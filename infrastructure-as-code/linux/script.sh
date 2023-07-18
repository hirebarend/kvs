# install
git clone https://github.com/hirebarend/kvs.git
cd kvs/infrastructure-as-code/linux
./main-standalone.sh

# update
cd kvs/typescript && git reset --hard HEAD && git pull && npm install && npm run build && node dist/main.js
