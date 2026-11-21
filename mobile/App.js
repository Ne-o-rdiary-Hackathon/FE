import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView } from "react-native-webview";

// 배포된 웹 주소 (https 필수).
const BASE_URL = "https://kankan-bingo.vercel.app/";

// 앱 안에서 열어야 하는 도메인. 그 외 링크는 휴대폰 기본 브라우저로 넘깁니다.
const IN_APP_HOSTS = [
  new URL(BASE_URL).host, // 우리 서비스
  // 앱 안에서 열어야 하는 도메인을 여기에 추가
];

export default function App() {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  const handleShouldStartLoad = (request) => {
    let host;
    try {
      host = new URL(request.url).host;
    } catch {
      return false;
    }
    if (IN_APP_HOSTS.includes(host)) return true;

    // 외부 http(s) 링크만 휴대폰 기본 브라우저로 넘기고, 나머지 스킴은 막음
    if (/^https?:\/\//.test(request.url)) {
      Linking.openURL(request.url).catch(() => {});
    }
    return false;
  };

  if (!BASE_URL.startsWith("https://")) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>
          BASE_URL 은 https:// 로 시작해야 합니다.
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>화면을 불러오지 못했어요</Text>
        <Pressable style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </Pressable>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: BASE_URL }}
        style={styles.webview}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onHttpError={(event) => {
          // 5xx 서버 오류는 에러 화면으로 전환
          if (event.nativeEvent.statusCode >= 500) {
            setIsLoading(false);
            setHasError(true);
          }
        }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        setSupportMultipleWindows={false}
      />
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
  },
  message: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#111",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
