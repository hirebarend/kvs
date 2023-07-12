// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;
using kvs;

Console.WriteLine("Running...");

int port = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")) ? 1337 : int.Parse(Environment.GetEnvironmentVariable("PORT"));

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Parse("0.0.0.0"), port));

tcpListener.Start();

while (true)
{
    var socket = await tcpListener.AcceptSocketAsync();

    Console.WriteLine("Connected");

    _ = HandleSocket(socket);
}


async static Task HandleSocket(Socket socket)
{
    while (true)
    {
        if (!socket.IsConnected())
        {
            return;
        }

        var buffer = new byte[4];

        var n = await socket.ReceiveAsync(buffer);

        if (n == 0)
        {
            return;
        }

        var bytes = Encoding.ASCII.GetBytes("PONG");

        await socket.SendAsync(bytes);
    }
}

