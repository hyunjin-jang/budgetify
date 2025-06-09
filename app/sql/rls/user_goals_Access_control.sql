CREATE POLICY "Allow authenticated users to select their goals" ON public.goals FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to insert goals" ON public.goals FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to update their goals" ON public.goals FOR
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

CREATE POLICY "Allow authenticated users to delete their goals" ON public.goals FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
);