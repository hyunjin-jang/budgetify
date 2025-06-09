CREATE POLICY "Allow authenticated users to select their budgets" ON budgets FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to insert budgets" ON budgets FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = user_id
  );

CREATE POLICY "Allow authenticated users to update their budgets" ON budgets FOR
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

CREATE POLICY "Allow authenticated users to delete their budgets" ON budgets FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = user_id
);