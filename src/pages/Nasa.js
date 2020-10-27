import React, { useEffect, useState } from 'react'
import Alert from '@material-ui/lab/Alert'
import { makeStyles, Paper, Grid, Divider, TextField, Button, Typography, Box } from '@material-ui/core'

import Loading from '../components/Loading'
import SelectComponent from '../components/SelectComponent'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(4),
        minWidth: 120,
    },
    alert: {
        margin: theme.spacing(2),
    },
    root: {
        marginBottom: theme.spacing(10),
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
}))

export default function Nasa() {

    const classes = useStyles()

    const [isLoading, setIsLoading] = useState(false)
    const [erro, setErro] = useState('')
    const [show, setShow] = useState(false) // controla visibilidade da comparação das imagens
    const [antes, setAntes] = useState('') // url da imagem retornada pela api da nasa, url da img antiga e mais atual
    const [depois, setDepois] = useState('')
    const [lat, setLat] = useState('') // lat
    const [lon, setLon] = useState('') // lon
    const [coords, setCoords] = useState([]) // lon
    const [dim, setDim] = useState(0.25) // dimension
    const [location, setLocation] = useState('') // localização da lat/lon

    const dimValues = [0.15, 0.25, 0.35]

    useEffect(() => {
        if (coords.length > 0) {
            setLat(coords[0])
            setLon(coords[1])
            getDadosNasaAPI(coords)
        }
    }, [coords])

    async function getDadosNasaAPI(useCoords) {

        setShow(false)
        setIsLoading(true)
        setErro('')

        let apiNasaKey = 'MbPaC6mbQWE42cZGxocdhII1A0H4ndoWFbPtKdQ8'
        let apiGeoKey = 'ebc49eaaebd44cebb53f0f9e453983de'

        let dataHoje = new Date()
        let dataAntesUrl = (dataHoje.getFullYear()-3) + "-" + (dataHoje.getMonth()+1) + "-" + dataHoje.getDate()

        let urlAntes = `https://api.nasa.gov/planetary/earth/imagery?lon=${useCoords[1]}&lat=${useCoords[0]}&date=${dataAntesUrl}&dim=${dim}&api_key=${apiNasaKey}`

        let urlDepois = `https://api.nasa.gov/planetary/earth/imagery?lon=${useCoords[1]}&lat=${useCoords[0]}&dim=${dim}&api_key=${apiNasaKey}` // The response will include the date and URL to the image that is closest to the supplied date. If not supplied, then the most recent image (i.e., closest to today) is returned 

        let geoUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiGeoKey}&q=${encodeURIComponent(useCoords[0] + ',' + useCoords[1])}&pretty=1&no_annotations=1`

        await fetch(geoUrl)
            .then(async response => {
                await response.json().then(data => {
                    console.log('OpenCage Geocoder limit:', data.rate.remaining)
                    setLocation(
                        `Localização aproximada encontrada: ${data.results[0].formatted}, 
                        Coordenadas: (${data.results[0].geometry.lat}, ${data.results[0].geometry.lng})`
                    )
                })
            })
            .catch(function (err) { setErro(`Houve um erro: ${err.message}`) })

        await fetch(urlAntes)
            .then(response => {
                setAntes(response.url)
                if (response.status !== 200) {
                    setAntes('')
                    setErro('')
                }
            })
            .catch(function (err) { setErro(`Houve um erro: ${err.message}`) })

        await fetch(urlDepois)
            .then(response => {
                setDepois(response.url)
                if (response.status !== 200) {
                    setDepois('')
                    setErro('')
                }
            })
            .catch(function (err) { setErro(`Houve um erro: ${err.message}`) })

        if (erro.length > 0) {
            setShow(false)
        }
        else {
            setShow(true)
        }
        setIsLoading(false)

    }

    async function getExampleCoords() {
        setCoords([-11.8613, -56.3207])
    }

    function getBrowserCoords() {
        if (!('geolocation' in navigator)) {
            alert("Navegador não tem suporte API Geolocation");
        }
        else {
            navigator.geolocation.getCurrentPosition(function (position) {
                let latitude = position.coords.latitude
                let longitude = position.coords.longitude
                setCoords([latitude, longitude])
            });
        }
    }

    function getInputCoords(e) {
        e.preventDefault()
        setCoords([lat, lon])
    }

    return (
        <div>


            <Typography component="div">
                <Box letterSpacing={6} m={1} fontSize="h2.fontSize" textAlign="center" fontWeight="fontWeightBold">
                    NASA Satellite - Earth API
                </Box>
            </Typography>

            <form onSubmit={getInputCoords} >
                <TextField id="standard-full-width"
                    label="Latitude"
                    type="number"
                    required
                    className={classes.formControl}
                    value={String(lat)}
                    onChange={(e) => setLat(parseFloat(e.target.value))}
                />
                <TextField id="standard-full-width"
                    label="Longitude"
                    type="number"
                    required
                    className={classes.formControl}
                    value={String(lon)}
                    onChange={(e) => setLon(parseFloat(e.target.value))}
                />
                <Button
                    variant="outlined"
                    type='submit'
                    className={classes.formControl}
                >Executar</Button>


                <Button variant="outlined" onClick={getExampleCoords} className={classes.formControl}>Exemplo</Button>
                <Button variant="outlined" onClick={getBrowserCoords} className={classes.formControl}>Minha localização aproximada</Button>

            </form>

            <SelectComponent label={"Dimensão"} menuItems={dimValues} value={dim} setOnChange={setDim} />
            <Divider />

            {isLoading && <Loading />}

            {erro.length > 0 && <Alert severity="error" className={classes.alert}>{erro}</Alert>}

            {
                !isLoading && !erro.length > 0 && show &&

                <>
                    <Alert severity="info" className={classes.alert}>
                        {location}. Fonte: <a href='https://opencagedata.com/api' target="_blank" rel="noopener noreferrer">https://opencagedata.com/api</a>
                    </Alert>

                    <Alert severity="info" className={classes.alert}>
                        Fonte das imagens: <a href='https://api.nasa.gov/' target="_blank" rel="noopener noreferrer">https://api.nasa.gov/</a>
                    </Alert>

                    <Grid container spacing={3} className={classes.root}>

                        <Grid item>
                            <Paper className={classes.paper}>
                                <figure>
                                    {
                                        antes.length > 0 &&
                                        <>
                                            <a href={antes} target="_blank" rel="noopener noreferrer">
                                                <img src={antes} alt={'Antes'} width={'400px'} />
                                            </a>
                                            <figcaption>Antes</figcaption>
                                        </>
                                    }
                                    {
                                        antes.length === 0 &&
                                        <figcaption>Não foi possível encontrar uma imagem.</figcaption>
                                    }
                                </figure>
                            </Paper>
                        </Grid>

                        <Grid item>
                            <Paper className={classes.paper}>
                                <figure>
                                    {
                                        depois.length > 0 &&
                                        <>
                                            <a href={depois} target="_blank" rel="noopener noreferrer">
                                                <img src={depois} alt={'Depois'} width={'400px'} />
                                            </a>
                                            <figcaption>Imagem mais recente</figcaption>
                                        </>
                                    }
                                    {
                                        depois.length === 0 &&
                                        <figcaption>Não foi possível encontrar uma imagem.</figcaption>
                                    }
                                </figure>
                            </Paper>
                        </Grid>

                    </Grid>
                </>
            }

        </div>
    )
}
