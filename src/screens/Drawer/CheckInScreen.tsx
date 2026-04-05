import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../theme';

const CheckInScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const checkInData = JSON.stringify({ userId: user?.id, ts: Date.now(), gym: 'BHUB' });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Gym Check-In</Text>
      <Text style={styles.subtitle}>Show this QR code at the entrance</Text>

      {/* QR Card */}
      <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.qrCard}>
        <View style={styles.qrWrapper}>
          <QRCode value={checkInData} size={200} backgroundColor="#FFFFFF" color="#000000" />
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.memberType}>@{user?.username} · {user?.membershipType}</Text>
      </LinearGradient>

      {/* Instructions */}
      <View style={styles.instructionCard}>
        {[
          { icon: '1️⃣', text: 'Open this screen on your phone' },
          { icon: '2️⃣', text: 'Show the QR code to the front desk staff' },
          { icon: '3️⃣', text: 'Staff will scan to verify your membership' },
        ].map(item => (
          <View key={item.icon} style={styles.instructionRow}>
            <Text style={styles.instructionIcon}>{item.icon}</Text>
            <Text style={styles.instructionText}>{item.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.validCard}>
        <Text style={styles.validIcon}>✅</Text>
        <Text style={styles.validText}>Valid until {user?.membershipExpiry}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.xl, paddingTop: Spacing.xxxl },
  backBtn: { marginBottom: Spacing.base },
  backText: { color: Colors.primary, fontSize: FontSize.base, fontWeight: '600' },
  title: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.xl },
  qrCard: { borderRadius: BorderRadius.xl, alignItems: 'center', padding: Spacing.xl, ...Shadow.orange, marginBottom: Spacing.lg },
  qrWrapper: { backgroundColor: '#FFFFFF', borderRadius: BorderRadius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  userName: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.text },
  memberType: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  instructionCard: { backgroundColor: Colors.card, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.base },
  instructionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm },
  instructionIcon: { fontSize: 20, marginRight: Spacing.base },
  instructionText: { fontSize: FontSize.md, color: Colors.textSecondary, flex: 1 },
  validCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.base },
  validIcon: { fontSize: 20 },
  validText: { fontSize: FontSize.md, color: Colors.success, fontWeight: '700' },
});

export default CheckInScreen;
