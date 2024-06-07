import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Typography,
  FormControl,
  TextField,
  Box,
  Paper
} from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    }
  },
  typography: {
    h4: {
      fontWeight: 700,
      marginBottom: '1rem',
    },
  },
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <Typography variant="body2">{`${payload[0].name}: ${payload[0].value}`}</Typography>
      </Box>
    );
  }

  return null;
};

const chartComponents = {
  bar: (data, properties) => (
    <BarChart width={properties.width} height={properties.height} data={data}>
      <XAxis dataKey={properties.nameKey} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey={properties.dataKey} fill={properties.fill || "#8884d8"} />
    </BarChart>
  ),
  pie: (data, properties) => (
    <PieChart width={properties.width} height={properties.height}>
      <Pie
        data={data}
        dataKey={properties.dataKey}
        nameKey={properties.nameKey}
        cx="50%"
        cy="50%"
        outerRadius={properties.outerRadius || 150}
        fill={properties.fill || "#8884d8"}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
    </PieChart>
  ),
  line: (data, properties) => (
    <LineChart width={properties.width} height={properties.height} data={data}>
      <XAxis dataKey={properties.nameKey} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey={properties.dataKey} stroke={properties.fill || "#8884d8"} />
    </LineChart>
  ),
  area: (data, properties) => (
    <AreaChart width={properties.width} height={properties.height} data={data}>
      <XAxis dataKey={properties.nameKey} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Area type="monotone" dataKey={properties.dataKey} stroke={properties.fill || "#8884d8"} fill={properties.fill || "#8884d8"} />
    </AreaChart>
  )
};

const App = () => {
  const [chart, setChart] = useState(null);
  const [data, setData] = useState([]);
  const [topN, setTopN] = useState(5);

  const fetchDashboardData = () => {
    axios
      .get("http://localhost:3001/dashboard-data")
      .then((response) => {
        setChart(response.data.chart);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const fetchTopUsers = (topN) => {
    axios
      .post("http://localhost:3001/top-users", { topN })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 2000); 
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchTopUsers(topN);
  }, [chart, topN]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Paper elevation={3} style={{ padding: '1rem', backgroundColor: chart?.properties?.backgroundColor || '#1e1e1e' }}>
            <FormControl variant="filled" fullWidth margin="normal">
              <TextField
                label="Top N Users"
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                value={topN}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setTopN(value);
                  fetchTopUsers(value);
                }}
              />
            </FormControl>
            {chart && (
              <>
                <Typography variant="h6" gutterBottom>
                  {chart.properties.title}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  {chartComponents[chart.type](data, chart.properties)}
                </ResponsiveContainer>
              </>
            )}
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
