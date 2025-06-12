export const monthlyBudgetPrompt = (
  availableAmount: number,
  budget: any,
  fixedExpenses: any,
  selectedTab: string
) => `
    너는 예산을 관리하는 프로야.  
    목표는 사람들이 예산을 관리하기 쉽도록 예산 관리 방법을 제시하는 거야.
    예산은 최대한 꼼꼼하고 세세하게 분배해야 해.

    다음 예산 정보를 바탕으로 **월별 예산 분배**를 3가지 방식으로 추천해주세요.

    ❗️주의사항:
    - **고정 지출은 이미 별도로 처리되었으므로 추천안에 포함하지 마세요.**
    - 추천 항목들은 **가용 예산 ${availableAmount.toLocaleString()}원** 안에서만 배분해야 합니다.
    - 총 예산 ${budget?.total_amount.toLocaleString()}원 중 고정 지출은 ${fixedExpenses?.reduce((sum: number, item: any) => sum + item.amount, 0) ?? 0}원이므로, 사용 가능한 예산은 ${availableAmount.toLocaleString()}원입니다.
    - **각 추천안에는 다음 두 필드를 포함해야 합니다:**
      - "savings": 가용 예산에서 allocations 총합을 뺀 절약 금액
      - "saving_ratio": 절약 금액이 가용 예산에서 차지하는 비율 (%) — 소수점 1자리까지

    예산 수준: ${budget?.level}

    반드시 아래 JSON 형식으로만 응답해주세요. 설명 없이 JSON만 출력해야 합니다:

    \`\`\`json
    {
      "추천 1": {
        "title": "예: 균형 분배",
        "description": "예: 항목별로 균등하게 배분한 방식입니다.",
        "savings": 예: 50000,
        "saving_ratio": 예: 14.5,
        "monthly": {
          "allocations": [
            { "category": "카테고리명", "amount": 금액 }
          ]
        }
      },
      "추천 2": {
        "title": "예: 절약 중심 분배",
        "description": "예: 필수 지출에 집중하고 절약 위주로 구성한 방식입니다.",
        "savings": 예: 80000,
        "saving_ratio": 예: 23.2,
        "monthly": {
          "allocations": [...]
        }
      },
      "추천 3": {
        "title": "예: 저축 우선 분배",
        "description": "예: 소비를 줄이고 저축에 많은 금액을 배분한 방식입니다.",
        "savings": 예: 120000,
        "saving_ratio": 예: 35.7,
        "monthly": {
          "allocations": [...]
        }
      }
    }
    \`\`\`

    ※ 다시 한 번 강조합니다:
    - **고정 지출 항목(예: 월세, 주차장 등)은 절대 포함하지 마세요.**
    - **"savings"와 "saving_ratio" 필드는 반드시 포함해야 하며, 논리적으로 일치해야 합니다.**
  `

export const weeklyBudgetPrompt = (
  availableAmount: number,
  budget: any,
  fixedExpenses: any,
  selectedTab: string
) => `
`

export const dailyBudgetPrompt = (
  availableAmount: number,
  budget: any,
  fixedExpenses: any,
  selectedTab: string
) => `
`