import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import { ListItem, SearchBar, Avatar } from "react-native-elements";
import Toast from "react-native-simple-toast";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [seed, setSeed] = useState(1);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const makeRemoteRequest = () => {
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (page === 1) {
          setData(res.results);
        } else {
          setData([...data, ...res.results]);
        }
        setError(res.error || null);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  };

  const handleRefresh = () => {
    setPage(1);
    setSeed(seed + 1);
    setRefreshing(true);
    makeRemoteRequest();

    console.log("Pull to Refresh");
    Toast.show("Pull to Refresh Done");
  };

  const handleLoadMore = () => {
    setPage(page + 1);
    console.log("page:", page);
    makeRemoteRequest();
    Toast.show("Scroll Loading Done.Page:" + page);
  };

  const renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." />;
  };

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    //   console.log(`${item.name.first} ${item.name.last}`);
    return (
      <ListItem bottomDivider>
        <Avatar source={{ uri: item.picture.thumbnail }} />
        <ListItem.Content>
          <ListItem.Title>{`${item.name.first} ${item.name.last}`}</ListItem.Title>
          <ListItem.Subtitle>{item.email}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );
  };

  useEffect(() => {
    makeRemoteRequest();
  }, []);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.email}
            ItemSeparatorComponent={renderSeparator}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});
