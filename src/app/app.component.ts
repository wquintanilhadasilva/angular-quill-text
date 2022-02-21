import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { QuillEditorComponent } from 'ngx-quill';
import { Quill, RangeStatic } from 'quill';

export interface AppTextRange {
  index: number;
  length: number;
}

export interface AppTag {
  range: AppTextRange;
  comment: string;
  userColor: string;
}

export interface AppPage {
  content: string;
  tags: AppTag[];
}

export interface AppDocument {
  filename: string;
  size: number;
  pages: AppPage[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'quill-lab';
  conteudo: any;

  documento: AppDocument | undefined;
  pageNumber: number = 0;
  page: AppPage | undefined;

  // conteudo: any;
  editorForm!: FormGroup;

  editorStyle = {
    height: '600px;'
  }

  // metaData:{ range: RangeStatic, comment: any }[] = [];

  @ViewChild('editor', { static: false, read: QuillEditorComponent })
  editor!: QuillEditorComponent;

  public get metaData(): AppTag[] {
    return this.page !== undefined ? this.page.tags : [];
  }

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null),
    });
  }


  ngAfterViewInit(): void {
    console.log(this.editor);
    this.editor.readOnly = true;
    // this.editor.readOnly = false;
  }

  save() {
    console.log(this.conteudo);
    console.log(this.editor);
    console.log(this.page);
  }

  onSubmit() {
    this.conteudo = this.editorForm.get('editor')!.value;
    console.log(this.editorForm.get('editor')!.value);
  }

  adicionarComentario() {

    const quill: Quill = this.editor.quillEditor;

    var content: RangeStatic | null = quill.getSelection()
    console.log(content);

    var prompt = window.prompt("Informe o nome do marcador:", "");
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
          this.page?.tags.push({ range: range, comment: prompt, userColor: "#fff72b" });
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

  onLoadDocument(): void {
    this.http.get<any>(`assets/data/documento.json`)
      .subscribe((doc: AppDocument) => {
        console.log(doc);
        this.documento = doc as AppDocument;
        this.pageNumber = 0;
        this.showContent(this.documento);
      });
  }

  previousPage(): void {

    if (this.documento && this.pageNumber > 0) {
      this.pageNumber--;
      this.showContent(this.documento);
    }
  }

  nextPage(): void {
    if (this.documento &&  this.documento.pages.length && this.pageNumber < this.documento.pages.length -1) {
      this.pageNumber++;
      this.showContent(this.documento);
    }
  }

  private showContent(doc: AppDocument): void {
    this.page = doc.pages[this.pageNumber];
    this.editorForm.patchValue({ editor: this.page.content });
    if (this.page.tags) {
      const quill: Quill = this.editor.quillEditor;
      this.page.tags.forEach(t => {
        var range: RangeStatic = { index: t.range.index, length: t.range.length };

        //Formata o texto
        quill.formatText(t.range.index, t.range.length, {
          background: t.userColor
        });
      });
    }

  }

}
