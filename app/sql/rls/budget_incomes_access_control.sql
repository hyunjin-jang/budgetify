CREATE POLICY "Allow authenticated users to select their budget incomes" ON public.budget_incomes FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = budget_id
  );

CREATE POLICY "Allow authenticated users to insert budget incomes" ON public.budget_incomes FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = budget_id
  );

CREATE POLICY "Allow authenticated users to update their budget incomes" ON public.budget_incomes FOR
UPDATE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = budget_id
)
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = budget_id
  );

CREATE POLICY "Allow authenticated users to delete their budget incomes" ON public.budget_incomes FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = budget_id
);