import { Routes } from "@angular/router";
import { MidiListComponent } from "./gui/midi-list/midi-list.component";
import { MididetailComponent } from "./gui/mididetail/mididetail.component";
import { UploadComponent } from "./api/upload/upload.component";

const routeConfig: Routes = [
    {path: '',
    component: MidiListComponent,
    title: 'Homepage'
    },
    {path: 'mididetails/:id',
    component: MididetailComponent,
    title: 'midi details'
    },
    {path: 'uploadmidi',
    component: UploadComponent,
    title: 'upload midi file'
    }
];

export default routeConfig;