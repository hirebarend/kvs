// See https://aka.ms/new-console-template for more information
using System.Net.Sockets;
using System.Net;
using System.Text;
using kvs;

int port = string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PORT")) ? 1337 : int.Parse(Environment.GetEnvironmentVariable("PORT"));

Console.WriteLine($"listening on 0.0.0.0:{port}");

var tcpListener = new TcpListener(new IPEndPoint(IPAddress.Parse("0.0.0.0"), port));

tcpListener.Start();

var dictionary = new Dictionary<string, string>();

while (true)
{
    var socket = await tcpListener.AcceptSocketAsync();

    _ = HandleSocket(socket, dictionary);
}


async static Task HandleSocket(Socket socket, Dictionary<string, string> dictionary)
{
    while (true)
    {
        if (!socket.IsConnected())
        {
            return;
        }

        var command = await Read(socket);

        if (command == "GET")
        {
            var key = await Read(socket);

            var value = dictionary.ContainsKey(key) ? dictionary[key] : "NULL";

            var bytes = new byte[1] { (byte)value.Length }.Concat(Encoding.ASCII.GetBytes(value)).ToArray();

            await socket.SendAsync(bytes);

            continue;
        }

        if (command == "SET")
        {
            var key = await Read(socket);

            var value = await Read(socket);

            dictionary[key] = value;

            var bytes = new byte[1] { 2 }.Concat(Encoding.ASCII.GetBytes("OK")).ToArray();

            await socket.SendAsync(bytes);

            continue;
        }
    }
}

async static Task<string?> Read(Socket socket)
{
    var buffer1 = new byte[1];

    var n1 = await socket.ReceiveAsync(buffer1, cancellationToken: new CancellationTokenSource(1000).Token);

    if (n1 == 0)
    {
        return null;
    }

    var buffer2 = new byte[buffer1[0]];

    var n2 = await socket.ReceiveAsync(buffer2, cancellationToken: new CancellationTokenSource(1000).Token);

    if (n2 == 0)
    {
        return null;
    }

    return Encoding.ASCII.GetString(buffer2);
}

