import React from 'react';
import {
    Container,
    CssBaseline,
    Grid,
    makeStyles,
    TextField,
} from '@material-ui/core';
import Toolbar from '@material-ui/core/Toolbar';
import TypesBuilder from './TypesBuilder';

interface IState {
}

export default class SchemaBuilder extends React.Component<{}, IState> {
    constructor(props: object) {
        super(props);
    }
    public render() {
        return(
            <main>
                <Toolbar />
                <Grid container justify="center">
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div id="schemabuilder" className={this.classes.paper}>
                            <form className={this.classes.form} noValidate>
                                <TypesBuilder />
                            </form>
                        </div>
                    </Container>
                </Grid>
           </main>
        );
    }

    private classes: any = makeStyles((theme) => ({
        root: {
            width: '100%',
            marginTop: 40,
        },
        paper: {
            marginTop: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(3),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        button: {
            margin: '10px',
        },
        previewChip: {
            minWidth: 160,
            maxWidth: 210,
        },
    }))

}
