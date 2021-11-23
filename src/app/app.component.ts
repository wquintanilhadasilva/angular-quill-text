import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { Quill, RangeStatic } from 'quill';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'quill-lab';
  conteudo: any;

  // conteudo: any;
  editorForm!: FormGroup;

  editorStyle = {
    height: '600px;'
  }

  metaData:{ range: RangeStatic, comment: any }[] = [];

  @ViewChild('editor', { static: false, read:QuillEditorComponent })
  editor!: QuillEditorComponent;

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null),
    });
  }


  ngAfterViewInit(): void {
    console.log(this.editor);
    // this.editor.readOnly = false;
  }

  save() {
    console.log(this.conteudo);
    console.log(this.editor);
  }

  onSubmit() {
    this.conteudo = this.editorForm.get('editor')!.value;
    console.log(this.editorForm.get('editor')!.value);
  }

  adicionarComentario() {

    const quill: Quill = this.editor.quillEditor;

    var content: RangeStatic | null = quill.getSelection()
    console.log(content);
    
    var prompt = window.prompt("Please enter Comment", "");
    var txt;
    if (prompt == null || prompt == "") {
      txt = "User cancelled the prompt.";
    } else {
      var range: RangeStatic | null = quill.getSelection();
      if (range) {
        if (range.length == 0) {
          alert("Please select text"); //, range.index);
        } else {
          var text = quill.getText(range.index, range.length);
          console.log("User has highlighted: ", text);
          this.metaData.push({ range: range, comment: prompt });
          quill.formatText(range.index, range.length, {
            background: "#fff72b"
          });
        }
      } else {
        alert("User cursor is not in editor");
      }
    }
  }

  selectTag(metaData: { range: RangeStatic, comment: any }) {

    console.log(metaData);

    this.editor.quillEditor.setSelection(metaData.range.index, metaData.range.length);


  }

}
