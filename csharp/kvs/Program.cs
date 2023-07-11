// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;

Console.WriteLine("Running...");

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Any, 6379));

tcpListener.Start();

while (true)
{
    var tcpClient = tcpListener.AcceptTcpClient();

    var networkStream = tcpClient.GetStream();

    var buffer = new byte[1024];

    int bytesRead;

    while (tcpClient.Connected)
    {
        if ((bytesRead = networkStream.Read(buffer, 0, buffer.Length)) != 0) {
            string dataReceived = Encoding.ASCII.GetString(buffer, 0, bytesRead);

            Console.WriteLine(dataReceived);

            byte[] responseData = Encoding.ASCII.GetBytes("+OK\r\n");

            networkStream.Write(responseData, 0, responseData.Length);
        }
    }
}

