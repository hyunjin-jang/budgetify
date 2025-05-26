-- expense_categories 테이블 시드 데이터
INSERT INTO
  expense_categories (id, name, user_id, created_at, updated_at)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    '식비',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e',
    '교통비',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'c3d4e5f6-a7b8-6c7d-0e9f-1a2b3c4d5e6f',
    '주거비',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'd4e5f6a7-b8c9-7d8e-1f0a-2b3c4d5e6f7a',
    '통신비',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'e5f6a7b8-c9d0-8e9f-2a1b-3c4d5e6f7a8b',
    '여가비',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  );

-- budgets 테이블 시드 데이터
INSERT INTO
  budgets (
    id,
    setting_method,
    level,
    total_amount,
    year,
    month,
    user_id,
    created_at,
    updated_at
  )
VALUES
  (
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    'amount',
    'basic',
    3000000,
    2024,
    3,
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'a7b8c9d0-e1f2-0a1b-4c3d-5e6f7a8b9c0d',
    'income_based',
    'intermediate',
    4000000,
    2024,
    3,
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'b8c9d0e1-f2a3-1b2c-5d4e-6f7a8b9c0d1e',
    'amount',
    'advanced',
    5000000,
    2024,
    3,
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'c9d0e1f2-a3b4-2c3d-6e5f-7a8b9c0d1e2f',
    'income_based',
    'basic',
    3500000,
    2024,
    3,
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'd0e1f2a3-b4c5-3d4e-7f6a-8b9c0d1e2f3a',
    'amount',
    'intermediate',
    4500000,
    2024,
    3,
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  );

-- budget_allocations 테이블 시드 데이터
INSERT INTO
  budget_allocations (
    id,
    budget_id,
    category,
    amount,
    created_at,
    updated_at
  )
VALUES
  (
    'e1f2a3b4-c5d6-4e5f-8a7b-9c0d1e2f3a4b',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '식비',
    1000000,
    NOW (),
    NOW ()
  ),
  (
    'f2a3b4c5-d6e7-5f6a-9b8c-0d1e2f3a4b5c',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '교통비',
    300000,
    NOW (),
    NOW ()
  ),
  (
    'a3b4c5d6-e7f8-6a7b-0c9d-1e2f3a4b5c6d',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '주거비',
    1000000,
    NOW (),
    NOW ()
  ),
  (
    'b4c5d6e7-f8a9-7b8c-1d0e-2f3a4b5c6d7e',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '통신비',
    200000,
    NOW (),
    NOW ()
  ),
  (
    'c5d6e7f8-a9b0-8c9d-2e1f-3a4b5c6d7e8f',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '여가비',
    500000,
    NOW (),
    NOW ()
  );

-- budget_fixed_expenses 테이블 시드 데이터
INSERT INTO
  budget_fixed_expenses (
    id,
    budget_id,
    title,
    amount,
    created_at,
    updated_at
  )
VALUES
  (
    'd6e7f8a9-b0c1-9d0e-3f2a-4b5c6d7e8f9a',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '월세',
    800000,
    NOW (),
    NOW ()
  ),
  (
    'e7f8a9b0-c1d2-0e1f-4a3b-5c6d7e8f9a0b',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '통신요금',
    100000,
    NOW (),
    NOW ()
  ),
  (
    'f8a9b0c1-d2e3-1f2a-5b4c-6d7e8f9a0b1c',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '보험료',
    150000,
    NOW (),
    NOW ()
  ),
  (
    'a9b0c1d2-e3f4-2a3b-6c5d-7e8f9a0b1c2d',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '운동장비',
    200000,
    NOW (),
    NOW ()
  ),
  (
    'b0c1d2e3-f4a5-3b4c-7d6e-8f9a0b1c2d3e',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '구독서비스',
    50000,
    NOW (),
    NOW ()
  );

-- budget_incomes 테이블 시드 데이터
INSERT INTO
  budget_incomes (
    id,
    budget_id,
    title,
    amount,
    created_at,
    updated_at
  )
VALUES
  (
    'c1d2e3f4-a5b6-4c5d-8e7f-9a0b1c2d3e4f',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '월급',
    3000000,
    NOW (),
    NOW ()
  ),
  (
    'd2e3f4a5-b6c7-5d6e-9f8a-0b1c2d3e4f5a',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '부수입',
    200000,
    NOW (),
    NOW ()
  ),
  (
    'e3f4a5b6-c7d8-6e7f-0a9b-1c2d3e4f5a6b',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '투자수익',
    100000,
    NOW (),
    NOW ()
  ),
  (
    'f4a5b6c7-d8e9-7f8a-1b0c-2d3e4f5a6b7c',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '용돈',
    50000,
    NOW (),
    NOW ()
  ),
  (
    'a5b6c7d8-e9f0-8a9b-2c1d-3e4f5a6b7c8d',
    'f6a7b8c9-d0e1-9f0a-3b2c-4d5e6f7a8b9c',
    '기타수입',
    30000,
    NOW (),
    NOW ()
  );

-- expenses 테이블 시드 데이터
INSERT INTO
  expenses (
    id,
    title,
    amount,
    date,
    category,
    user_id,
    created_at,
    updated_at
  )
VALUES
  (
    'b6c7d8e9-f0a1-9b2c-3d4e-5f6a7b8c9d0e',
    '점심식사',
    15000,
    '2024-03-01',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'c7d8e9f0-a1b2-0c3d-4e5f-6a7b8c9d0e1f',
    '택시비',
    8000,
    '2024-03-01',
    'b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'd8e9f0a1-b2c3-1d4e-5f6a-7b8c9d0e1f2a',
    '영화관람',
    15000,
    '2024-03-02',
    'e5f6a7b8-c9d0-8e9f-2a1b-3c4d5e6f7a8b',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'e9f0a1b2-c3d4-2e5f-6a7b-8c9d0e1f2a3b',
    '커피',
    4500,
    '2024-03-02',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'f0a1b2c3-d4e5-3f6a-7b8c-9d0e1f2a3b4c',
    '통신요금',
    100000,
    '2024-03-03',
    'd4e5f6a7-b8c9-7d8e-1f0a-2b3c4d5e6f7a',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  );

-- goals 테이블 시드 데이터
INSERT INTO
  goals (
    id,
    title,
    amount,
    start_date,
    end_date,
    status,
    user_id,
    created_at,
    updated_at
  )
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e0f1a2b3c4d',
    '여행 자금 모으기',
    2000000,
    '2024-03-01',
    '2024-06-30',
    'in_progress',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'b2c3d4e5-f6a7-5b6c-9d8e-0f1a2b3c4d5e',
    '노트북 구매',
    1500000,
    '2024-03-01',
    '2024-04-30',
    'scheduled',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'c3d4e5f6-a7b8-6c7d-0e9f-1a2b3c4d5e6f',
    '비상금 모으기',
    5000000,
    '2024-03-01',
    '2024-12-31',
    'scheduled',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'd4e5f6a7-b8c9-7d8e-1f0a-2b3c4d5e6f7a',
    '운동장비 구매',
    300000,
    '2024-03-01',
    '2024-03-31',
    'completed',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  ),
  (
    'e5f6a7b8-c9d0-8e9f-2a1b-3c4d5e6f7a8b',
    '자격증 취득',
    500000,
    '2024-03-01',
    '2024-05-31',
    'scheduled',
    '376adda7-64d1-4eb0-a962-2465dbc9f2cb',
    NOW (),
    NOW ()
  );