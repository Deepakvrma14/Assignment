import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { createTheme, ThemeProvider, CssBaseline, Container, Typography, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const chartTypes = {
    bar: BarChart,
    pie: PieChart,
    line: LineChart,
    area: AreaChart,
    radar: RadarChart,
    composed: ComposedChart
};

const App = () => {
    const [data, setData] = useState([]);
    const [chartType, setChartType] = useState('bar');
    const [charts, setCharts] = useState([]);
    const [topN, setTopN] = useState(5);

    useEffect(() => {
        axios.get('http://localhost:3001/charts')
            .then(response => {
                setCharts(response.data);
            })
            .catch(error => {
                console.error('Error fetching charts:', error);
            });
    }, []);

    const fetchTopUsers = () => {
        axios.post('http://localhost:3001/top-users', { topN })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    useEffect(() => {
        fetchTopUsers();
    }, [topN]);

    const ChartComponent = chartTypes[chartType];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <Typography variant="h4" gutterBottom>
                    Dashboard
                </Typography>
                <FormControl variant="filled" fullWidth margin="normal">
                    <InputLabel>Chart Type</InputLabel>
                    <Select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        {charts.map(chart => (
                            <MenuItem key={chart.type} value={chart.type}>
                                {chart.type.charAt(0).toUpperCase() + chart.type.slice(1)} Chart
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" fullWidth margin="normal">
                    <TextField
                        label="Top N Users"
                        type="number"
                        value={topN}
                        onChange={(e) => setTopN(e.target.value)}
                        variant="filled"
                    />
                </FormControl>
                <Button variant="contained" color="primary" onClick={fetchTopUsers} fullWidth>
                    Update
                </Button>
                <ResponsiveContainer width="100%" height={400} style={{ marginTop: '20px' }}>
                    {chartType === 'bar' ? (
                        <ChartComponent data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </ChartComponent>
                    ) : chartType === 'pie' ? (
                        <ChartComponent>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8">
                                {
                                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'][index % 5]} />)
                                }
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </ChartComponent>
                    ) : chartType === 'line' ? (
                        <ChartComponent data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="#8884d8" />
                        </ChartComponent>
                    ) : chartType === 'area' ? (
                        <ChartComponent data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                        </ChartComponent>
                    ) : chartType === 'radar' ? (
                        <ChartComponent data={data}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="name" />
                            <PolarRadiusAxis />
                            <Radar name="Users" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Legend />
                        </ChartComponent>
                    ) : (
                        <ChartComponent data={data}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                            <Line type="monotone" dataKey="value" stroke="#ff7300" />
                        </ChartComponent>
                    )}
                </ResponsiveContainer>
            </Container>
        </ThemeProvider>
    );
};

export default App;
