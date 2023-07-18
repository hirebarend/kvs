sudo ufw allow 1337

# dotnet
sudo apt-get update
sudo apt-get install -y dotnet-sdk-7.0
sudo apt-get install -y dotnet-runtime-7.0

# nodejs
sudo apt update
sudo apt -y install nodejs
sudo apt -y install npm

npm install -g pm2

# kvs/csharp
cd ../../csharp
dotnet restore
dotnet publish -c Release -o out
dotnet out/kvs.dll

# kvs/typescript
cd ../../typescript
npm install
npm run build

pm2 start dist/main.js

# kvs/benchmark
cd ../../benchmark
npm install
npm run build

pm2 start dist/main.js
