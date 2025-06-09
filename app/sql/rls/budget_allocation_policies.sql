CREATE POLICY "Allow authenticated users to select their budget allocations" ON public.budget_allocations FOR
SELECT
  TO authenticated USING (
    (
      select
        auth.uid ()
    ) = recommendation_id
  );

CREATE POLICY "Allow authenticated users to insert budget allocations" ON public.budget_allocations FOR INSERT TO authenticated
WITH
  CHECK (
    (
      select
        auth.uid ()
    ) = recommendation_id
  );

CREATE POLICY "Allow authenticated users to update their budget allocations" ON public.budget_allocations FOR
UPDATE TO authenticated USING (
  (
    select
      auth.uid ()
  ) = recommendation_id
)
WITH
  CHECK (
    (
      select
        auth.uid ()
    ) = recommendation_id
  );

CREATE POLICY "Allow authenticated users to delete their budget allocations" ON public.budget_allocations FOR DELETE TO authenticated USING (
  (
    select
      auth.uid ()
  ) = recommendation_id
);