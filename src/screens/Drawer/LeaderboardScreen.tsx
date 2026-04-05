import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MOCK_LEADERBOARD } from '../../api/mockData';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../theme';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const LeaderboardScreen = ({ navigation }: any) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
    <LinearGradient colors={[Colors.primaryDark, Colors.background]} style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <Text style={styles.subtitle}>Top senders this month</Text>
    </LinearGradient>

    <FlatList
      data={MOCK_LEADERBOARD}
      keyExtractor={item => item.rank.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isMe = item.username === 'alextan_climbs';
        return (
          <View style={[styles.row, isMe && styles.rowMe]}>
            <Text style={styles.rank}>
              {MEDAL[item.rank] ?? `#${item.rank}`}
            </Text>
            <View style={[styles.avatar, isMe && styles.avatarMe]}>
              <Text style={styles.avatarText}>
                {item.name.split(' ').map((n: string) => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, isMe && styles.nameMe]}>{item.name}</Text>
              <Text style={styles.username}>@{item.username}</Text>
            </View>
            <View style={styles.statsGroup}>
              <Text style={[styles.sends, isMe && styles.sendsMe]}>{item.sends}</Text>
              <Text style={styles.sendsLabel}>sends</Text>
            </View>
            <View style={styles.gradePill}>
              <Text style={styles.gradePillText}>{item.grade}</Text>
            </View>
          </View>
        );
      }}
      ListFooterComponent={<View style={{ height: 100 }} />}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: Spacing.xxxl, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xl },
  backBtn: { marginBottom: Spacing.base },
  backText: { color: Colors.primary, fontSize: FontSize.base, fontWeight: '600' },
  title: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  list: { padding: Spacing.base },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: BorderRadius.lg,
    padding: Spacing.base, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border, gap: Spacing.sm,
  },
  rowMe: { borderColor: Colors.primary, backgroundColor: 'rgba(254,128,4,0.1)' },
  rank: { fontSize: 22, width: 36, textAlign: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceAlt, alignItems: 'center', justifyContent: 'center',
  },
  avatarMe: { backgroundColor: Colors.primary },
  avatarText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.text },
  info: { flex: 1 },
  name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  nameMe: { color: Colors.primary },
  username: { fontSize: FontSize.xs, color: Colors.textMuted },
  statsGroup: { alignItems: 'center' },
  sends: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.text },
  sendsMe: { color: Colors.primary },
  sendsLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  gradePill: { backgroundColor: Colors.surfaceAlt, borderRadius: BorderRadius.sm, paddingHorizontal: 8, paddingVertical: 4 },
  gradePillText: { fontSize: FontSize.xs, fontWeight: '800', color: Colors.primary },
});

export default LeaderboardScreen;
