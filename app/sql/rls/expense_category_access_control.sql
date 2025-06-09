CREATE POLICY "Allow authenticated users to select their expense categories" ON public.expense_categories FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to insert expense categories" ON public.expense_categories FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to update their expense categories" ON public.expense_categories FOR
UPDATE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
)
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to delete their expense categories" ON public.expense_categories FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
);