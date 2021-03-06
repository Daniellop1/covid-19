import React from 'react';
import CardsList from '../components/CardsList';
import './styles/Home.css';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import axios from 'axios';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      query: '',
      countries: undefined,
      filteredCountries: [],
      noMatches: false,
    };
  }

  filterCountries = query => {
    this.setState({ noMatches: false });
    const result = this.state.countries.filter(country => {
      return country.Country.toLowerCase().startsWith(query.toLowerCase());
    });
    if (result.length === 0) this.setState({ noMatches: true });
    this.setState({ filteredCountries: result });
  };

  componentDidMount() {
    this.getData();
    // this.getDataSocket();
  }

  handleChange = query => {
    this.setState({ query });
    this.filterCountries(query);
  };

  getData = async () => {
    this.setState({ loading: true, error: null });
    try {
      const response = await axios.get('https://api.covid19api.com/summary');
      this.setState({
        loading: false,
        countries: response.data.Countries,
      });
    } catch (error) {
      this.setState({ loading: false, error: error });
    }
  };

  getDataSocket = () => {
    this.setState({ loading: true, error: null });
    const ws = new WebSocket('ws://https://api.covid19api.com/summary');
    ws.onopen = () => {
      console.log('Connected');
    };
    ws.onmessage = event => {
      const data = JSON.parse(event.data);
      console.log(data);
      this.setState({ loading: false, countries: data });
    };
    ws.onclose = () => {
      console.log('Connection ended');
    };
  };

  render() {
    if (this.state.loading) {
      return (
        <React.Fragment>
          <Navbar />
          <div className="home">
            <Loader />
          </div>
        </React.Fragment>
      );
    }
    if (this.state.error) {
      return (
        <React.Fragment>
          <Navbar query={this.state.query} onChange={this.handleChange} />
          <div className="home">
            <h2>Error</h2>
          </div>
        </React.Fragment>
      );
    }
    if (this.state.filteredCountries.length !== 0) {
      return (
        <React.Fragment>
          <Navbar query={this.state.query} onChange={this.handleChange} />
          <div className="home">
            <CardsList query={this.state.query} countries={this.state.filteredCountries} />
          </div>
        </React.Fragment>
      );
    }
    if (this.state.noMatches) {
      return (
        <React.Fragment>
          <Navbar query={this.state.query} onChange={this.handleChange} />
          <div className="home">
            <p className="message">Country "{this.state.query}" not found 😢</p>
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <Navbar query={this.state.query} onChange={this.handleChange} />
        <div className="home">
          <CardsList query={this.state.query} countries={this.state.countries} />
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
