// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;

Console.WriteLine("Running...");

int port = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")) ? 6379 : int.Parse(Environment.GetEnvironmentVariable("PORT"));

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Any, port));

tcpListener.Start();

while (true)
{
    var tcpClient = tcpListener.AcceptTcpClient();

    Console.WriteLine("Connected");

    _ = HandleTcpClientAsync(tcpClient);
}

static async Task HandleTcpClientAsync(TcpClient tcpClient)
{
    try
    {
        var networkStream = tcpClient.GetStream();

        var buffer = new byte[1024];

        int bytesRead;

        while (true)
        {
            if ((bytesRead = networkStream.Read(buffer, 0, buffer.Length)) != 0)
            {
                string dataReceived = Encoding.ASCII.GetString(buffer, 0, bytesRead);

                Console.WriteLine(dataReceived);

                byte[] responseData = Encoding.ASCII.GetBytes("+OK\r\n");

                networkStream.Write(responseData, 0, responseData.Length);
            }
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine("Error: " + ex.Message);
    }
    finally
    {
    }
}
