// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;
using kvs;

Console.WriteLine("Running...");

int port = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")) ? 1337 : int.Parse(Environment.GetEnvironmentVariable("PORT"));

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Parse("0.0.0.0"), port));

tcpListener.Start();

var sockets = new List<Socket>();

while (true)
{
    if (tcpListener.Pending())
    {
        var socket = tcpListener.AcceptSocket();

        socket.ReceiveTimeout = 50;

        sockets.Add(socket);

        Console.WriteLine("Connected");
    }

    HandleSockets(sockets);
}

static void HandleSockets(List<Socket> sockets)
{
    foreach (var socket in sockets)
    {
       var result = HandleSocket(socket);
    }
}

static bool HandleSocket(Socket socket)
{
    try
    {
        if (!socket.IsConnected())
        {
            return false;
        }

        var buffer = new byte[4];

        var n = socket.Receive(buffer);

        if (n == 0)
        {
            return true;
        }

        var bytes = Encoding.ASCII.GetBytes("PONG");

        socket.SendAsync(bytes);
    }
    catch (Exception ex)
    {

    }

    return true;
}

