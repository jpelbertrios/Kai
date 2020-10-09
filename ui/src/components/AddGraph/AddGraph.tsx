import React from 'react';
import {
    Button,
    Container,
    CssBaseline,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    makeStyles,
    Slide,
    TextField,
    Tooltip,
    Zoom,
} from '@material-ui/core';
import { Schema } from '../../domain/schema';
import { Notifications } from '../../domain/notifications';
import { CreateGraphRepo } from '../../rest/repositories/create-graph-repo';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import { DropzoneArea } from 'material-ui-dropzone';
import { TransitionProps } from '@material-ui/core/transitions';
import Toolbar from '@material-ui/core/Toolbar';
import { AlertType, NotificationAlert } from '../Errors/NotificationAlert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import ClearIcon from '@material-ui/icons/Clear';
import { ElementsSchema } from '../../domain/elements-schema';
import { TypesSchema } from '../../domain/types-schema';
import { type } from 'os';

interface IState {
    dialogIsOpen: boolean;
    files: Array<File>;
    schemaFieldDisable: boolean;
    newGraph: {
        graphName: string;
        schemaJson: string;
    };
    outcome: AlertType | undefined;
    outcomeMessage: string;
    errors: Notifications;
    elements: string;
    types: string;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default class AddGraph extends React.Component<{}, IState> {
    constructor(props: object) {
        super(props);
        this.state = {
            dialogIsOpen: false,
            schemaFieldDisable: false,
            files: [],
            newGraph: {
                graphName: '',
                schemaJson: '',
            },
            outcome: undefined,
            outcomeMessage: '',
            errors: new Notifications(),
            elements: '',
            types: '',
        };
    }

    private async submitNewGraph() {
        const { graphName, schemaJson } = this.state.newGraph;
        const schema = new Schema(schemaJson);
        const elements = new ElementsSchema(this.state.elements);
        const types = new TypesSchema(this.state.types);
        const errors: Notifications = elements.validate();
        errors.concat(types.validate());

        if (errors.isEmpty()) {
            try {
                await new CreateGraphRepo().create(graphName, [], elements, types);
                this.setState({ outcome: AlertType.SUCCESS, outcomeMessage: `${graphName} was successfully added` });
                this.resetForm();
            } catch (e) {
                this.setState({
                    outcome: AlertType.FAILED,
                    outcomeMessage: `Failed to Add '${graphName}' Graph: ${e.message}`,
                });
            }
        } else {
            this.setState({ errors });
        }
    }

    private resetForm() {
        this.setState({
            files: [],
            newGraph: {
                graphName: '',
                schemaJson: '',
            },
            elements: '',
            types: '',
        });
    }

    private async uploadFiles(files: File[]) {
        this.setState({ files: files });
        if (files.length > 0) {
            const schemaFromFile = await files[0].text();

            this.setState({
                schemaFieldDisable: true,
                newGraph: {
                    ...this.state.newGraph,
                    schemaJson: schemaFromFile,
                },
            });
        } else {
            this.setState({
                schemaFieldDisable: false,
            });
        }
    }

    private disableSubmitButton(): boolean {
        const { graphName, schemaJson } = this.state.newGraph;
        return !this.state.elements || !this.state.types || !graphName;
    }

    public render() {
        const openDialogBox = () => {
            this.setState({ dialogIsOpen: true });
        };
        const closeDialogBox = () => {
            this.setState({ dialogIsOpen: false });
        };

        return (
            <main>
                {this.state.outcome && (
                    <NotificationAlert alertType={this.state.outcome} message={this.state.outcomeMessage} />
                )}
                {!this.state.errors.isEmpty() && (
                    <NotificationAlert
                        alertType={AlertType.FAILED}
                        message={`Error(s): ${this.state.errors.errorMessage()}`}
                    />
                )}
                <Toolbar />

                <Grid container justify="center">
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <div className={this.classes.paper}>
                            <form className={this.classes.form} noValidate>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="graph-name"
                                            label="Graph Name"
                                            variant="outlined"
                                            value={this.state.newGraph.graphName}
                                            required
                                            fullWidth
                                            name="graphName"
                                            autoComplete="graph-name"
                                            onChange={(event) => {
                                                this.setState({
                                                    newGraph: {
                                                        ...this.state.newGraph,
                                                        graphName: event.target.value,
                                                    },
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} container direction="row" justify="flex-end" alignItems="center">
                                        <Tooltip TransitionComponent={Zoom} title="Add Schema From File">
                                            <IconButton id="attach-file-button" onClick={openDialogBox}>
                                                <AttachFileIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip TransitionComponent={Zoom} title="Clear Schema">
                                            <IconButton
                                                onClick={() =>
                                                    this.setState({
                                                        newGraph: {
                                                            ...this.state.newGraph,
                                                            schemaJson: '',
                                                        },
                                                    })
                                                }
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Dialog
                                            id="dropzone"
                                            open={this.state.dialogIsOpen}
                                            TransitionComponent={Transition}
                                            keepMounted
                                            onClose={closeDialogBox}
                                            style={{ minWidth: '500px' }}
                                            aria-labelledby="alert-dialog-slide-title"
                                            aria-describedby="alert-dialog-slide-description"
                                        >
                                            <Grid container direction="row" justify="flex-end" alignItems="flex-start">
                                                <IconButton id="close-dropzone-button" onClick={closeDialogBox}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </Grid>
                                            <DialogContent>
                                                <DropzoneArea
                                                    showPreviews={true}
                                                    onChange={async (files) => this.uploadFiles(files)}
                                                    showPreviewsInDropzone={false}
                                                    useChipsForPreview
                                                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                                                    previewChipProps={{ classes: { root: this.classes.previewChip } }}
                                                    previewText="Selected files"
                                                    clearOnUnmount={true}
                                                    acceptedFiles={['application/json']}
                                                    filesLimit={1}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            id="schema-elements"
                                            style={{ width: 400 }}
                                            value={this.state.elements}
                                            label="Schema Elements JSON"
                                            required
                                            multiline
                                            rows={5}
                                            name="schema-elements"
                                            variant="outlined"
                                            onChange={(event) => {
                                                this.setState({
                                                    elements: event.target.value,
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="schema-types"
                                            style={{ width: 400 }}
                                            value={this.state.types}
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
                            </form>
                        </div>
                    </Container>
                    <Grid container style={{ margin: 10 }} direction="row" justify="center" alignItems="center">
                        <Button
                            id="add-new-graph-button"
                            onClick={() => {
                                this.submitNewGraph();
                            }}
                            startIcon={<AddCircleOutlineOutlinedIcon />}
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={this.classes.submit}
                            disabled={this.disableSubmitButton()}
                        >
                            Add Graph
                        </Button>
                    </Grid>
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
    }));
}
