#!/bin/bash

# DuMall 奢侈品电商平台打包脚本
# 此脚本将分别打包前端和后端，并将它们组织在一个发布目录中

# 颜色设置
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT=$(pwd)
DIST_DIR="$PROJECT_ROOT/dist"

echo -e "${YELLOW}===== DuMall 奢侈品电商平台打包 =====${NC}"
echo -e "${GREEN}创建发布目录${NC}"

# 创建发布目录
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
mkdir -p "$DIST_DIR/frontend"
mkdir -p "$DIST_DIR/backend"

# 打包前端
echo -e "\n${YELLOW}===== 打包前端 =====${NC}"
cd "$PROJECT_ROOT"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}使用已安装的依赖${NC}"
else
  echo -e "${GREEN}安装前端依赖${NC}"
  npm install
fi

echo -e "${GREEN}执行前端构建${NC}"
npm run build

if [ $? -eq 0 ]; then
  echo -e "${GREEN}前端构建成功${NC}"
  # 复制构建文件到发布目录
  cp -r "$PROJECT_ROOT/dist" "$DIST_DIR/frontend/"
  echo -e "${GREEN}前端文件已复制到 $DIST_DIR/frontend/${NC}"
else
  echo -e "${RED}前端构建失败${NC}"
  exit 1
fi

# 打包后端
echo -e "\n${YELLOW}===== 打包后端 =====${NC}"
cd "$PROJECT_ROOT/backend"
echo -e "${GREEN}执行后端构建${NC}"
./mvnw clean package -DskipTests

if [ $? -eq 0 ]; then
  echo -e "${GREEN}后端构建成功${NC}"
  # 复制JAR文件到发布目录
  cp "$PROJECT_ROOT/backend/target/"*.jar "$DIST_DIR/backend/"
  echo -e "${GREEN}后端JAR文件已复制到 $DIST_DIR/backend/${NC}"
else
  echo -e "${RED}后端构建失败${NC}"
  exit 1
fi

# 创建启动脚本
echo -e "\n${YELLOW}===== 创建启动脚本 =====${NC}"
cat > "$DIST_DIR/start.sh" << 'EOF'
#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 启动后端
echo -e "${YELLOW}===== 启动后端 =====${NC}"
cd backend
nohup java -jar *.jar > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}后端已启动，PID: $BACKEND_PID${NC}"

# 记录PID
echo $BACKEND_PID > backend.pid

echo -e "${YELLOW}===== 前端文件位于 frontend/dist 目录，请部署到Web服务器 =====${NC}"
echo -e "${GREEN}启动完成${NC}"
EOF

chmod +x "$DIST_DIR/start.sh"

# 创建停止脚本
cat > "$DIST_DIR/stop.sh" << 'EOF'
#!/bin/bash
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 停止后端
echo -e "${YELLOW}===== 停止后端 =====${NC}"
if [ -f backend/backend.pid ]; then
  PID=$(cat backend/backend.pid)
  if ps -p $PID > /dev/null; then
    kill $PID
    echo -e "${GREEN}后端已停止，PID: $PID${NC}"
  else
    echo -e "${RED}后端进程不存在${NC}"
  fi
  rm backend/backend.pid
else
  echo -e "${RED}找不到后端PID文件${NC}"
fi

echo -e "${GREEN}停止完成${NC}"
EOF

chmod +x "$DIST_DIR/stop.sh"

# 复制README
cp "$PROJECT_ROOT/README.md" "$DIST_DIR/"

echo -e "\n${GREEN}===== 打包完成 =====${NC}"
echo -e "打包文件位于: ${YELLOW}$DIST_DIR${NC}"
echo -e "启动应用: ${YELLOW}$DIST_DIR/start.sh${NC}"
echo -e "停止应用: ${YELLOW}$DIST_DIR/stop.sh${NC}" 