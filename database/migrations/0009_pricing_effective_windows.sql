CREATE EXTENSION IF NOT EXISTS btree_gist;
DROP INDEX one_active_price_book_per_market;
ALTER TABLE price_books DROP CONSTRAINT price_books_state_check;
UPDATE price_books SET state='PUBLISHED' WHERE state='ACTIVE';
ALTER TABLE price_books ADD CONSTRAINT price_books_state_check CHECK (state IN ('DRAFT','PUBLISHED','RETIRED'));

-- GiST exclusions arbitrate simultaneous inserts/updates, including direct SQL.
-- Adjacent [from,until) windows are permitted; NULL upper bounds are unbounded.
ALTER TABLE price_books ADD CONSTRAINT published_market_windows_do_not_overlap
  EXCLUDE USING gist (market WITH =, tstzrange(effective_from,effective_until,'[)') WITH &&)
  WHERE (state='PUBLISHED');

CREATE FUNCTION guard_price_book_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.state IN ('PUBLISHED','RETIRED') THEN
    RAISE EXCEPTION 'Published and retired price books are immutable' USING ERRCODE='23514';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  IF NEW.id<>OLD.id OR NEW.state='RETIRED' THEN
    RAISE EXCEPTION 'Invalid price book lifecycle' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER price_books_immutable_history BEFORE UPDATE OR DELETE ON price_books
FOR EACH ROW EXECUTE FUNCTION guard_price_book_history();

CREATE FUNCTION guard_price_entry_history() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE book_id uuid; book_state text;
BEGIN
  IF TG_OP='UPDATE' AND (NEW.price_book_id<>OLD.price_book_id OR NEW.variant_id<>OLD.variant_id) THEN
    RAISE EXCEPTION 'Price entry identity is immutable' USING ERRCODE='23514';
  END IF;
  IF TG_OP='DELETE' THEN book_id:=OLD.price_book_id; ELSE book_id:=NEW.price_book_id; END IF;
  -- Entry mutation and publication serialize on the same parent row.
  SELECT state INTO book_state FROM price_books WHERE id=book_id FOR UPDATE;
  IF book_state<>'DRAFT' THEN
    RAISE EXCEPTION 'Published price entries are immutable' USING ERRCODE='23514';
  END IF;
  IF TG_OP='DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER price_entries_immutable_history BEFORE INSERT OR UPDATE OR DELETE ON price_book_entries
FOR EACH ROW EXECUTE FUNCTION guard_price_entry_history();
