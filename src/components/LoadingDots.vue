<template>
  <div class="loading-dots" aria-label="正在思考">
    <span /><span /><span />
  </div>
</template>

<style scoped>
.loading-dots {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 4px 2px;
}
.loading-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ivy-500);
  animation: dot 1.25s ease-in-out infinite;
}
.loading-dots span:nth-child(2) { animation-delay: 0.16s; background: var(--honey-500); }
.loading-dots span:nth-child(3) { animation-delay: 0.32s; background: var(--ivy-700); }

@keyframes dot {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.45; }
  40%           { transform: translateY(-6px); opacity: 1; }
}
</style>
