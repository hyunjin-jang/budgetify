CREATE POLICY "Allow authenticated users to select their budget recommendations" ON public.budget_recommendations FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to insert budget recommendations" ON public.budget_recommendations FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to update their budget recommendations" ON public.budget_recommendations FOR
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

CREATE POLICY "Allow authenticated users to delete their budget recommendations" ON public.budget_recommendations FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
);