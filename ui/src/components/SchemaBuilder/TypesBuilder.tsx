import React from 'react';
import { Button, Container, CssBaseline, Grid, makeStyles, TextField } from '@material-ui/core';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Toolbar from '@material-ui/core/Toolbar';

interface IState {
    types: string;
}

export default class TypesBuilder extends React.Component<{}, IState> {
    constructor(props: object) {
        super(props);
        this.state = {
            types: '',
        };
    }

    private disableSubmitButton(): boolean {
//        const { graphName } = this.state.newGraph;
//        return !this.state.elements || !this.state.types || !graphName;
        return false;
    }

    public render() {
        return (
            <Grid container spacing={2} item xs={12}>
                <TextField
                    id="type-name"
                    label="Type Name"
                    variant="outlined"
                    value={undefined}
                    required
                    fullWidth
                    name="typeName"
                    autoComplete="type-name"
                    onChange={(event) => {}}
                />
                <TextField
                    id="class-name"
                    label="Class"
                    variant="outlined"
                    value={undefined}
                    required
                    fullWidth
                    name="className"
                    autoComplete="class-name"
                    onChange={(event) => {}}
                />
                <TextField
                    id="aggregate-name"
                    label="Aggregate Function"
                    variant="outlined"
                    value={undefined}
                    required
                    fullWidth
                    name="aggregateName"
                    autoComplete="aggregate-name"
                    onChange={(event) => {}}
                />
                <TextField
                    id="serialiser-name"
                    label="Serialiser"
                    variant="outlined"
                    value={undefined}
                    required
                    fullWidth
                    name="serialiserName"
                    autoComplete="serialiser-name"
                    onChange={(event) => {}}
                />
                <Grid container style={{ margin: 10 }} direction="row" justify="center" alignItems="center">
                    <Button
                        id="add-new-graph-button"
                        onClick={() => {}}
                        startIcon={<AddCircleOutlineOutlinedIcon />}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={this.classes.submit}
                        disabled={this.disableSubmitButton()}
                    >
                        Add Type
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="types-json"
                        style={{ width: 400 }}
                        value={this.state.types}
                        disabled={false}
                        name="schema-types"
                        label="Schema Types JSON"
                        required
                        multiline
                        rows={5}
                        variant="outlined"
                        onChange={(event) => {
                            this.setState({
                                types: event.target.value,
                            });
                        }}
                    />
                </Grid>
            </Grid>
        );
    }

    private classes: any = makeStyles((theme) => ({
        root: {
            width: '100%',
            marginTop: 40,
        },
        paper: {
            margin: theme.spacing(2),
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
            margin: theme.spacing(2),
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
    }));
}
