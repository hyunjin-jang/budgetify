import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export default function WelcomeUser({ username }: { username: string }) {
  return (
    <Html>
      <Head />
      <Preview>MoneyDoby에 오신 것을 환영합니다!</Preview>
      <Tailwind>
        <Body className="bg-[#f6f9fc] my-auto mx-auto font-sans">
          <Container className="max-w-[600px] w-full my-[40px] mx-auto p-[20px]">
            <Section className="bg-white rounded-lg shadow-sm p-[20px]">
              <Section className="mt-[20px]">
                <Img
                  src="https://your-logo-url.com/logo.png"
                  width="120"
                  height="40"
                  alt="MoneyDoby"
                  className="mx-auto"
                />
              </Section>

              <Heading className="text-black text-[24px] font-bold text-center p-0 my-[30px] mx-0">
                환영합니다, <br />
                <strong className="text-[#2563eb]">{username}</strong>님!
              </Heading>

              <Text className="text-[#4b5563] text-[16px] leading-[24px] text-center">
                MoneyDoby에 가입해주셔서 감사합니다.
                <br />
                이제 더 스마트한 금융 관리를 시작해보세요.
              </Text>

              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#2563eb] rounded-lg text-white text-[16px] px-[32px] py-[16px] font-semibold no-underline text-center"
                  href="https://moneydoby.com/dashboard"
                >
                  대시보드로 이동하기
                </Button>
              </Section>

              <Section className="mt-[32px]">
                <Text className="text-[#4b5563] text-[16px] leading-[24px] text-center">
                  MoneyDoby와 함께라면
                  <br />더 나은 금융 생활이 시작됩니다
                </Text>
              </Section>

              <Hr className="border border-solid border-[#e5e7eb] my-[32px] mx-0 w-full" />

              <Text className="text-[#6b7280] text-[14px] leading-[20px] text-center">
                이 이메일은 MoneyDoby 서비스 가입을 위해 발송되었습니다.
                <br />
                {/* 문의사항이 있으시다면{" "}
                <Link
                  href="mailto:support@moneydoby.com"
                  className="text-[#2563eb] underline"
                >
                  support@moneydoby.com
                </Link>
                으로 연락주세요. */}
              </Text>
            </Section>

            <Text className="text-[#9ca3af] text-[12px] text-center mt-[20px]">
              © 2024 MoneyDoby. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
