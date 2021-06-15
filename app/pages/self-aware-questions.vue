<template>
  <div>
    <h1 class="text-h4 font-weight-bold my-5">{{ title }}</h1>
    <blockquote class="text-body-1">
      <ol class="mb-6">
        <li>
          あなたはどんな価値観で育てられましたか？自分のいまの思考体系は、それらの価値観を反映しているものですか、それとも育てられたものとは違う視点で世界を見ていますか？
        </li>
        <li>
          幼い頃や思春期における最も重要な出来事および経験は何ですか？それらが自分の世界観にどう影響を与えましたか？
        </li>
        <li>
          職場や私生活で、どんな人たちを一番尊敬していて、その人たちのどんなところを尊敬していますか？
        </li>
        <li>
          一番尊敬していないのはどんな人で、なぜそんな風に思いますか？
        </li>
        <li>
          これまでで最高（最悪）の上司は誰ですか？
          そう思うのは、その上司が何をしたからですか？
        </li>
        <li>
          自分の子供を育てたり、他人を指導するにあたり、一番伝えたいのはどんな行動で、一番伝えたくないのはどんな行動ですか？
        </li>
      </ol>
      <cite style="font-style: normal">
        <a
          href="https://www.amazon.co.jp/dp/B07T1HDC8J?tag=lorem-ipsum-22"
          target="_blank"
          rel="noopener noreferrer"
        >
          insight(インサイト)――いまの自分を正しく知り、仕事と人生を劇的に変える自己認識の力</a
        >
        より引用
      </cite>
    </blockquote>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

export default Vue.extend({
  computed: {
    title() {
      return 'あなたの価値観を知るための質問'
    }
  },
  head(): MetaInfo {
    return {
      title: this.title
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
