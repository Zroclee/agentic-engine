<template>
  <div class="min-h-screen bg-base-200 font-sans">
    <!-- Navbar 顶部导航 -->
    <Header :showNav="true" :fixed="true" />

    <!-- Hero Section -->
    <div class="hero min-h-[70vh] bg-base-200 mt-16">
      <div class="hero-content text-center">
        <div class="max-w-3xl">
          <div class="badge badge-primary badge-outline mb-4">Agentic as a Service</div>
          <h1 class="text-5xl font-bold mb-6">智擎中台 · AI驱动万物</h1>
          <p class="py-6 text-xl text-base-content/80">
            面向企业级业务场景的智能体中台。帮助客户零代码/低代码地将现有业务系统快速AI化。
            左侧对话，右侧业务组件实时联动，在对话过程中即时调整方向，最终输出结构化业务报告。
          </p>
          <div class="flex justify-center gap-4 mt-4">
            <router-link to="/admin" class="btn btn-primary btn-lg">开始使用</router-link>
            <a href="#features" class="btn btn-outline btn-lg">了解更多</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-24 bg-base-100">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-16">核心特性</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                AaaS 架构
              </h3>
              <p>遵循 Agentic as a Service 范式，让智能体成为可配置的服务，无缝集成到任何业务流程中。</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                AI驱动页面
              </h3>
              <p>对话流与业务组件双向绑定，AI根据上下文自动调用工具、更新组件数据，提供极致交互体验。</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                配置化接入
              </h3>
              <p>无需编码，通过可视化界面配置模型、提示词、工具(HTTP API)和远程组件，快速上线。</p>
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                实时对比与决策
              </h3>
              <p>右侧组件内调整数据，AI即时分析差异并给出专业建议，辅助业务决策。</p>
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
                动态组件集成
              </h3>
              <p>支持 Vue 3、React 或原生 Web Components 远程加载，安全隔离，灵活扩展业务场景。</p>
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            <div class="card-body">
              <h3 class="card-title text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                一键报告生成
              </h3>
              <p>基于对话历史和组件交互数据，一键自动生成专业的 Markdown 或 PDF 结构化业务报告。</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <div class="flex gap-4">
        <a class="link link-hover">关于我们</a>
        <a class="link link-hover">API文档</a>
        <a class="link link-hover">用户手册</a>
        <a class="link link-hover">GitHub</a>
      </div>
      <div>
        <p>Copyright © {{ new Date().getFullYear() }} - 智擎团队 AgenticEngine</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Header from '@/components/layout/Header.vue'
import { useAppStore } from '@/store/app'

const appStore = useAppStore()

onMounted(async () => {
  // 如果用户信息未初始化（初次加载），尝试获取以恢复登录态
  if (!appStore.isInitialized) {
    try {
      await appStore.fetchUserInfo()
    } catch (error) {
      // 未登录或 token 失效时静默处理即可，导航栏会保持未登录状态
      console.log('未登录或登录态已失效')
    }
  }
})
</script>
