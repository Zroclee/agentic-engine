import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // 输出 CommonJS 和 ES Modules
  dts: true, // 生成类型声明文件
  clean: true, // 每次构建前清理 dist 目录
  sourcemap: true, // 生成 sourcemap 方便调试
  minify: false, // 核心库通常不需要压缩，让使用方去压缩
  splitting: false, // 禁用代码分割
});
