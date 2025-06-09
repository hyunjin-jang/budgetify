CREATE POLICY "Allow authenticated users to select their expenses" ON public.expenses FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to insert expenses" ON public.expenses FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to update their expenses" ON public.expenses FOR
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

CREATE POLICY "Allow authenticated users to delete their expenses" ON public.expenses FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
);