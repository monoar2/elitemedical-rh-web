// src/services/websocket.js
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { WS_URL } from '@/config/env';

let stompClient = null;
const subscribers = [];

export function connectWebSocket(employeeId) {
    const socket = new SockJS(WS_URL);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        stompClient.subscribe(`/user/${employeeId}/topic/notifications`, (message) => {
            const notification = JSON.parse(message.body);
            subscribers.forEach(callback => callback(notification.content));
        });
    }, (error) => {
        console.error('WebSocket connection error:', error);
    });
}

export function disconnectWebSocket() {
    if (stompClient) {
        stompClient.disconnect();
    }
}

export function onNotification(callback) {
    subscribers.push(callback);
}