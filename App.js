
import React, { useEffect, useState } from 'react';

import {
  View,
  FlatList,
  StyleSheet
} from 'react-native';

import {
  Provider as PaperProvider,
  Text,
  Card,
  Button,
  ActivityIndicator
} from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';

// Criando a navegação
const Stack = createNativeStackNavigator();

// API de filmes
const API_URL =
  'https://www.omdbapi.com/?s=spider%20man&apikey=1cd66749';


// ====================================
// TELA PRINCIPAL - LISTA DE FILMES
// ====================================

function HomeScreen({ navigation }) {

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Buscar filmes na API
  const getMovies = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await fetch(API_URL);

      const json = await response.json();

      if (json.Response === 'False') {
        throw new Error(json.Error);
      }

      setData(json.Search || []);

    } catch (error) {

      console.error(error);
      setError('Não foi possível carregar os filmes.');

    } finally {

      setLoading(false);

    }
  };

  // Executar a busca quando abrir a tela
  useEffect(() => {
    getMovies();
  }, []);

  // Exibir cada filme
  const renderMovie = ({ item }) => {

    return (

      <Card style={styles.card}>

        <Card.Cover
          source={{ uri: item.Poster }}
          style={styles.poster}
        />

        <Card.Content>

          <Text variant="titleMedium" style={styles.movieTitle}>
            {item.Title}
          </Text>

          <Text variant="bodyMedium">
            Ano: {item.Year}
          </Text>

          <Text variant="bodySmall">
            Tipo: {item.Type}
          </Text>

        </Card.Content>

        <Card.Actions>

          <Button
            mode="contained"
            onPress={() =>
              navigation.navigate('Details', {
                movie: item
              })
            }
          >
            Ver detalhes
          </Button>

        </Card.Actions>

      </Card>

    );

  };

  return (

    <View style={styles.container}>

      <Text variant="headlineMedium" style={styles.title}>
        Lista de Filmes
      </Text>

      {isLoading ? (

        <ActivityIndicator
          animating={true}
          size="large"
          style={styles.loading}
        />

      ) : error ? (

        <View style={styles.center}>

          <Text>{error}</Text>

          <Button
            mode="contained"
            onPress={getMovies}
          >
            Tentar novamente
          </Button>

        </View>

      ) : (

        <FlatList
          data={data}
          renderItem={renderMovie}
          keyExtractor={(item) => item.imdbID}
          contentContainerStyle={styles.list}
        />

      )}

    </View>

  );

}


// ====================================
// SEGUNDA TELA - DETALHES DO FILME
// ====================================

function DetailsScreen({ route, navigation }) {

  const { movie } = route.params;

  return (

    <View style={styles.detailsContainer}>

      <Card style={styles.detailsCard}>

        <Card.Cover
          source={{ uri: movie.Poster }}
          style={styles.detailsPoster}
        />

        <Card.Content>

          <Text variant="headlineSmall" style={styles.movieTitle}>
            {movie.Title}
          </Text>

          <Text variant="bodyLarge">
            Ano: {movie.Year}
          </Text>

          <Text variant="bodyLarge">
            Tipo: {movie.Type}
          </Text>

          <Text variant="bodyLarge">
            IMDb ID: {movie.imdbID}
          </Text>

        </Card.Content>

      </Card>

      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Voltar para lista
      </Button>

    </View>

  );

}


// ====================================
// APLICATIVO PRINCIPAL
// ====================================

export default function App() {

  return (

    <PaperProvider>

      <NavigationContainer>

        <Stack.Navigator>

          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Lista de Filmes'
            }}
          />

          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{
              title: 'Detalhes do Filme'
            }}
          />

        </Stack.Navigator>

      </NavigationContainer>

    </PaperProvider>

  );

}


// ====================================
// ESTILIZAÇÃO
// ====================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold'
  },

  card: {
    marginBottom: 20,
    backgroundColor: '#ffffff'
  },

  poster: {
    height: 250
  },

  movieTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8
  },

  list: {
    paddingBottom: 20
  },

  loading: {
    marginTop: 50
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15
  },

  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },

  detailsCard: {
    backgroundColor: '#ffffff'
  },

  detailsPoster: {
    height: 350
  },

  backButton: {
    marginTop: 20
  }

});
