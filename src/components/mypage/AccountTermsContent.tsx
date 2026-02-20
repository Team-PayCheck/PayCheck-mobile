import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "../common/Text";
import { colors } from "../../constants/colors";

const AccountTermsContent: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text weight="Bold" style={styles.title}>계정 이용 / 이용동의</Text>

      {/* 1. 계정 이용 안내 */}
      <Text weight="Bold" style={styles.sectionTitle}>1. 계정 이용 안내</Text>
      <Text style={styles.paragraph}>
        본 서비스는 고용주와 근로자 간의 투명한 근무 기록 관리 및 원활한 급여 지급 보조를 목적으로 합니다.{"\n"}
        - 계정 책임: 사용자는 본인의 계정 정보를 타인에게 양도하거나 대여할 수 없으며, 관리 소홀로 발생하는 모든 책임은 사용자 본인에게 있습니다.{"\n"}
        - 기록의 증빙: 앱 내에서 관리되는 출퇴근 기록 및 급여 산정 데이터는 양측의 합의를 바탕으로 기록되며, 송금 보조 기능을 이용할 시 반드시 최종 액수를 재확인해야 합니다.
      </Text>

      {/* 2. 개인정보 수집 및 이용 동의 */}
      <Text weight="Bold" style={styles.sectionTitle}>2. 개인정보 수집 및 이용 동의</Text>
      <Text style={styles.paragraph}>
        서비스 제공을 위해 아래와 같은 최소한의 개인정보를 수집합니다.{"\n"}
        - 수집 항목: 성명, 연락처, 이메일 주소, 생년월일, 계좌번호, 은행명, 사업장 정보(고용주), 근무 위치 데이터(GPS).{"\n"}
        - 이용 목적: 회원 식별, 근무 일정 알림 제공, 급여 산정 및 송금 인터페이스 지원, 부정 이용 방지 및 고객 상담.{"\n"}
        - 보유 기간: 서비스 탈퇴 시까지 (단, 관련 법령 및 부정 이용 방지를 위해 필요한 경우 일정 기간 보관될 수 있습니다.)
      </Text>

      {/* 3. 급여 송금 보조 서비스 관련 고지 */}
      <Text weight="Bold" style={styles.sectionTitle}>3. 급여 송금 보조 서비스 관련 고지</Text>
      <Text style={styles.paragraph}>
        송금 주체: 본 앱은 송금을 '보조'하는 인터페이스를 제공할 뿐, 직접적인 금융 거래의 당사자가 아닙니다. 실제 송금은 각 금융기관의 뱅킹 시스템을 통해 이루어집니다.{"\n"}
        오송금 주의: 고용주는 근로자의 계좌 정보와 확정 급여를 최종 승인한 후 송금을 진행해야 하며, 입력 오류로 인한 오송금 발생 시 앱은 이에 대한 법적 책임을 지지 않습니다.
      </Text>

      {/* 4. 위치 정보 이용 동의 (선택) */}
      <Text weight="Bold" style={styles.sectionTitle}>4. 위치 정보 이용 동의 (선택)</Text>
      <Text style={styles.paragraph}>
        목적: 사업장 내 출퇴근 인증의 정확성을 위해 사용자의 현재 위치 정보를 확인합니다.{"\n"}
        거부 시 불이익: 선택 권한을 거부하실 수 있으나, 이 경우 특정 사업장의 자동 출퇴근 인증 기능 이용이 제한될 수 있습니다.
      </Text>

      {/* 5. 제3자 제공 및 위탁 (필수) */}
      <Text weight="Bold" style={styles.sectionTitle}>5. 제3자 제공 및 위탁 (필수)</Text>
      <Text style={styles.paragraph}>
        본 서비스는 원활한 급여 송금 인터페이스 제공을 위해 결제 대행사(PG) 및 금융 보안 솔루션 업체에 필요한 최소한의 정보를 제공할 수 있습니다.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 18,
    marginBottom: 6,
    color: colors.textPrimary,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 2,
  },
});

export default AccountTermsContent;
