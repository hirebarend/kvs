sudo ufw allow 1337

# dotnet
sudo apt-get update
sudo apt upgrade
sudo apt-get install -y dotnet-sdk-7.0
sudo apt-get install -y dotnet-runtime-7.0

# go
sudo apt update
sudo apt upgrade
sudo wget https://go.dev/dl/go1.20.6.linux-amd64.tar.gz
sudo tar -C /usr/local/ -xzf go1.20.6.linux-amd64.tar.gz
cd /usr/local/
sudo nano $HOME/.profile
# export PATH=$PATH:/usr/local/go/bin
source $HOME/.profile
cd $HOME
go version

# nodejs
sudo apt update
sudo apt upgrade
curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
sudo bash /tmp/nodesource_setup.sh
sudo apt -y install nodejs
# sudo dpkg -i --force-overwrite /var/cache/apt/archives/nodejs_20.5.0-deb-1nodesource1_amd64.deb
# sudo apt -y install npm

npm install -g pm2

# kvs/csharp
cd ../../csharp
dotnet restore
dotnet publish -c Release -o out
dotnet out/kvs.dll

# kvs/go
cd ../../go
go run main.go

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
