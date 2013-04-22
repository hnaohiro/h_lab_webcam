require 'opencv'
require 'em-websocket'
require 'base64'

class WebCam
  def initialize
    @captures = Array.new

    loop do
      begin
        capture = OpenCV::CvCapture.open(@captures.size)
        @captures.push(capture)
      rescue
        break
      end
    end
  end

  def size
    @captures.size
  end

  def get_with_base64
    data = Array.new
    @captures.each do |cap|
      mat = cap.query.to_CvMat
      data.push(Base64.encode64(mat.encode('.jpg').pack('C*')))
    end
    data
  end
end

EM::run do
  webCam = WebCam.new
  connections = Array.new

  EM::WebSocket.start(:host => '0.0.0.0', :port => 51234) do |ws|
    ws.onopen do |handshake|
      puts 'connected from ' + get_ip(ws)
      connections.push(ws)
    end

    ws.onclose do |handshake|
      puts 'closed from ' + get_ip(ws)
      connections.delete(ws)
    end
  end

  EM::defer do
    loop do
      sleep 0.1
      next if connections.size == 0

      images = webCam.get_with_base64
      connections.each do |con|
        con.send(images[0]);
      end
    end
  end

  def get_ip(con)
    if con.get_peername == nil
      'unknown'
    else
      _, ip = Socket.unpack_sockaddr_in(con.get_peername)
      ip
    end
  end
end
