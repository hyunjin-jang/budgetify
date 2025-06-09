CREATE POLICY "Allow authenticated users to select their own profile" ON public.profiles FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid ()
    ) = id
  );

CREATE POLICY "Allow authenticated users to insert their profile" ON public.profiles FOR INSERT TO authenticated
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = id
  );

CREATE POLICY "Allow authenticated users to update their own profile" ON public.profiles FOR
UPDATE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = id
)
WITH
  CHECK (
    (
      SELECT
        auth.uid ()
    ) = id
  );

CREATE POLICY "Allow authenticated users to delete their own profile" ON public.profiles FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid ()
  ) = id
);