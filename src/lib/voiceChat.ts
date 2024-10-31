import * as mediasoupClient from 'mediasoup-client';
import { Socket, io } from 'socket.io-client';
import { useStore } from '../store/useStore';

class VoiceChat {
  private socket: Socket;
  private device: mediasoupClient.Device | null = null;
  private producerTransport: mediasoupClient.Transport | null = null;
  private consumerTransports: Map<string, mediasoupClient.Transport> = new Map();
  private producer: mediasoupClient.Producer | null = null;
  private consumers: Map<string, mediasoupClient.Consumer> = new Map();
  private stream: MediaStream | null = null;
  private isMuted: boolean = false;
  private isDeafened: boolean = false;

  constructor() {
    this.socket = io('http://localhost:3001');
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('routerRtpCapabilities', async (routerRtpCapabilities) => {
      await this.loadDevice(routerRtpCapabilities);
    });

    this.socket.on('producerTransportCreated', async (params) => {
      await this.connectProducerTransport(params);
    });

    this.socket.on('consumerTransportCreated', async (params) => {
      await this.connectConsumerTransport(params);
    });

    this.socket.on('newProducer', async (producerId) => {
      await this.consume(producerId);
    });
  }

  private async loadDevice(routerRtpCapabilities: mediasoupClient.RtpCapabilities) {
    try {
      this.device = new mediasoupClient.Device();
      await this.device.load({ routerRtpCapabilities });
    } catch (error) {
      console.error('Failed to load device:', error);
    }
  }

  private async connectProducerTransport(params: any) {
    if (!this.device) return;

    this.producerTransport = this.device.createSendTransport(params);
    
    this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await this.socket.emit('connectProducerTransport', { dtlsParameters });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    this.producerTransport.on('produce', async (parameters, callback, errback) => {
      try {
        const { id } = await this.socket.emit('produce', parameters);
        callback({ id });
      } catch (error) {
        errback(error);
      }
    });
  }

  private async connectConsumerTransport(params: any) {
    if (!this.device) return;

    const consumerTransport = this.device.createRecvTransport(params);
    
    consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await this.socket.emit('connectConsumerTransport', { dtlsParameters });
        callback();
      } catch (error) {
        errback(error);
      }
    });

    this.consumerTransports.set(params.id, consumerTransport);
  }

  private async consume(producerId: string) {
    if (!this.device || this.consumerTransports.size === 0) return;

    const transport = Array.from(this.consumerTransports.values())[0];
    const { rtpCapabilities } = this.device;

    const { id, kind, rtpParameters } = await this.socket.emit(
      'consume',
      { producerId, rtpCapabilities }
    );

    const consumer = await transport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });

    this.consumers.set(producerId, consumer);

    const { track } = consumer;
    const stream = new MediaStream([track]);
    
    const { updateUserStatus } = useStore.getState();
    updateUserStatus(producerId, true, true);
  }

  public async joinVoiceChannel(channelId: string) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!this.device || !this.producerTransport) return;

      this.producer = await this.producerTransport.produce({
        track: this.stream.getAudioTracks()[0],
      });

      this.socket.emit('joinVoiceChannel', { channelId });
      
      const { updateUserStatus, currentUser } = useStore.getState();
      if (currentUser) {
        updateUserStatus(currentUser.id, true, true);
      }
    } catch (error) {
      console.error('Failed to join voice channel:', error);
    }
  }

  public leaveVoiceChannel() {
    if (this.producer) {
      this.producer.close();
      this.producer = null;
    }

    this.consumers.forEach((consumer) => consumer.close());
    this.consumers.clear();

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    this.socket.emit('leaveVoiceChannel');
    
    const { updateUserStatus, currentUser } = useStore.getState();
    if (currentUser) {
      updateUserStatus(currentUser.id, true, false);
    }
  }

  public toggleMute() {
    if (this.stream) {
      this.isMuted = !this.isMuted;
      this.stream.getAudioTracks().forEach(track => {
        track.enabled = !this.isMuted;
      });
    }
  }

  public toggleDeafen() {
    this.isDeafened = !this.isDeafened;
    this.consumers.forEach(consumer => {
      const track = consumer.track;
      if (track) {
        track.enabled = !this.isDeafened;
      }
    });
  }

  public async changeAudioDevice(deviceId: string, type: 'input' | 'output') {
    try {
      if (type === 'input' && this.producer) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } }
        });
        
        const newTrack = newStream.getAudioTracks()[0];
        await this.producer.replaceTrack({ track: newTrack });
        
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }
        this.stream = newStream;
      }
      // Note: Output device selection is handled by the browser's audio system
    } catch (error) {
      console.error('Failed to change audio device:', error);
    }
  }
}

export const voiceChat = new VoiceChat();