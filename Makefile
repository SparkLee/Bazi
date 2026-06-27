# 知命 · 八字命理排盘 —— 常用命令封装
# 用法：在 Windows 的 Git Bash 中执行 `make <目标>`，例如 `make dev`
# 需已安装 GNU Make（Git Bash 可用 `make` 或 `mingw32-make`）

# 可覆盖变量：make preview PORT=8080
PORT ?= 3200

# 帮助标题（由 help 目标从本文件读取并打印，避免在 recipe 中直接写中文导致 Windows 下乱码）
# HELP_TITLE: 知命 · 八字命理排盘 —— 可用命令

.DEFAULT_GOAL := help
.PHONY: help install ci dev build preview lint clean clean-all reinstall push

help: ## 显示所有可用命令
	@grep -E '^# HELP_TITLE:' $(MAKEFILE_LIST) | sed -E 's/^# HELP_TITLE:[[:space:]]*//'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## 安装依赖（npm install）
	npm install

ci: ## 按 lock 文件干净安装依赖（npm ci）
	npm ci

dev: ## 启动开发服务器（热更新）
	npm run dev

build: ## 静态构建，产物输出到 out/
	npm run build

preview: build ## 构建后本地预览 out（默认端口 3200，可 PORT 覆盖）
	@echo "预览地址：http://localhost:$(PORT)"
	python -m http.server $(PORT) --directory out

lint: ## 运行 ESLint 检查
	npm run lint

clean: ## 清理构建产物（.next / out）
	rm -rf .next out

clean-all: clean ## 清理构建产物 + node_modules
	rm -rf node_modules

reinstall: clean-all ci ## 彻底重装（清理后 npm ci）

push: ## 提交并推送到远程，用法：make push MSG="提交说明"
	@if [ -z "$(MSG)" ]; then echo "请提供提交说明：make push MSG=\"...\""; exit 1; fi
	git add -A && git commit -m "$(MSG)" && git push
