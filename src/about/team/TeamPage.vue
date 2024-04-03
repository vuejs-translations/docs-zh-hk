<script lang="ts">
const shuffleMembers = (members: Member[], pinTheFirstMember = false): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    [
      members[offset + i - 1],
      members[offset + j]
    ] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>認識團隊</template>
      <template #lead>Vue 及其生態系統發展的背後是一個國際化的團隊，以下是部分團員的個人信息。</template>

      <template #action>
        <VTLink href="https://github.com/vuejs/governance/blob/master/Team-Charter.md">瞭解更多團隊信息</VTLink>
      </template>
    </TeamHero>

    <TeamList :members="membersCoreData as Member[]">
      <template #title>核心團隊成員</template>
      <template #lead>核心團隊成員是積極參與維護一個或多個核心項目的人。他們對 Vue 的生態系統做出了重大貢獻，並對項目及其用戶的成功做出了長期的承諾。</template>
    </TeamList>

    <TeamList :members="membersEmeritiData as Member[]">
      <template #title>名譽核心團隊</template>
      <template #lead>我們在此致敬過去曾做出過突出貢獻的不再活躍的團隊成員。</template>
    </TeamList>

    <TeamList :members="membersPartnerData as Member[]">
      <template #title>社區夥伴</template>
      <template #lead>一些 Vue 的社區成員讓這裡變得更加豐富多彩，有必要在此特別提及。我們與這些主要合作伙伴建立了更加親密的關係，經常與他們就即將到來的功能和新聞展開協作。</template>
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
