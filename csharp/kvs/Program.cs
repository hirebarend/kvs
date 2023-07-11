// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;

Console.WriteLine("Running...");

int port = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")) ? 6379 : int.Parse(Environment.GetEnvironmentVariable("PORT"));

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Parse("0.0.0.0"), port));

tcpListener.Start();

while (true)
{
    var socket = await tcpListener.AcceptSocketAsync();

    Console.WriteLine("Connected");

    _ = HandleTcpClientAsync(socket);
}

static async Task HandleTcpClientAsync(Socket socket)
{
    try
    {
        while (true)
        {
            var buffer = new byte[1024];

            var n = await socket.ReceiveAsync(buffer);

            if (n == 0)
            {
                Thread.Sleep(1000);
            }

            var str = Encoding.ASCII.GetString(buffer, 0, n);

            Console.WriteLine(str);

            var bytes = Encoding.ASCII.GetBytes("+OK\r\n");

            await socket.SendAsync(bytes);
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
