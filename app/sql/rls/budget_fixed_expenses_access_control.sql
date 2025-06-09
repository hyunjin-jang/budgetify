CREATE POLICY "Allow authenticated users to select their budget fixed expenses" ON public.budget_fixed_expenses FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = budget_id
  );

CREATE POLICY "Allow authenticated users to insert budget fixed expenses" ON public.budget_fixed_expenses FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = budget_id
  );

CREATE POLICY "Allow authenticated users to update their budget fixed expenses" ON public.budget_fixed_expenses FOR
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

CREATE POLICY "Allow authenticated users to delete their budget fixed expenses" ON public.budget_fixed_expenses FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = budget_id
);