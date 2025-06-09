DROP TRIGGER IF EXISTS budget_update_trigger ON budgets;

CREATE OR REPLACE FUNCTION delete_budget_recommendations_and_allocations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM budget_allocations
    WHERE recommendation_id IN (
        SELECT id 
        FROM budget_recommendations 
        WHERE budget_id = OLD.id
    );
    
    DELETE FROM budget_recommendations
    WHERE budget_id = OLD.id;
    
    RETURN OLD;
END;
$$;

CREATE TRIGGER budget_update_trigger
AFTER UPDATE ON budgets
FOR EACH ROW
EXECUTE FUNCTION delete_budget_recommendations_and_allocations();
