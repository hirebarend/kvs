using System.Net.Sockets;

namespace kvs
{
    public static class SocketExtensions
    {
        public static bool IsConnected(this Socket socket)
        {
            bool part1 = socket.Poll(50, SelectMode.SelectRead);

            bool part2 = (socket.Available == 0);

            if (part1 && part2)
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }
}
