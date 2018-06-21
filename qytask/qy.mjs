import XLSX from 'js-xlsx';

class Position {
  constructor() {
    this.Name = 0;
    this.ShortName = 0;
    this.Type = 0;
    this.Metadata = 0;
    this.Length = 0;
    this.Required = 0;
    this.Range = 0;
    this.Version = 0;
    this.Remark = 0;
  }
}

class QYDecode {

  constructor(workbook) {
    this.workbook = workbook;
    this.NameTag = {n: "Name", v: "Name"};
    this.ShortNameTag = {n: "Short Name", v: "ShortName"};
    this.TypeTag = {n: "Type", v: "Type"};
    this.MetadataTag = {n: "Metadata", v: "Metadata"};
    this.LengthTag = {n: "Length", v: "Length"};
    this.RequiredTag = {n: "Required", v: "Required"};
    this.RangeTag = {n: "Range", v: "Range"};
    this.VersionTag = {n: "Version", v: "Version"};
    this.RemarkTag = {n: "Remark", v: "Remark"};
    this.tags = [this.NameTag,
      this.ShortNameTag,
      this.TypeTag,
      this.MetadataTag,
      this.LengthTag,
      this.RequiredTag,
      this.RangeTag,
      this.VersionTag,
      this.RemarkTag];
  }

  setSheet(sheet) {
    this.sheet = sheet;
    this.ref = XLSX.utils.decode_range(this.sheet['!ref']);
    this.pos = new Position();
    this.res = {name: "", reg: RegExp(/Response/i), cell_ref: 0};
    this.req = {name: "", reg: RegExp(/Request/i), cell_ref: 0};
    this.setTagPosition();
    this.setResReqCell();
  }

  getFirstRow() {
    return {s: {c: 0, r: 0}, e: {c: this.ref.e.c, r: 0}};
  }

  getFirstCol() {
    return {s: {c: 0, r: 0}, e: {c: 0, r: this.ref.e.r}};
  }

  setTagPosition() {
    let firstRow = this.getFirstRow(this.ref);
    for (let C = firstRow.s.c; C < firstRow.e.c; ++C) {
      let cell_address = {c: C, r: 0};
      let cell_ref = XLSX.utils.encode_cell(cell_address);
      let cell = this.sheet[cell_ref];
      for (let i = 0; i < this.tags.length; i++) {
        if (cell.w && (cell.w.toUpperCase() === this.tags[i].n.toUpperCase())) {
          this.pos[this.tags[i].v] = cell_ref;
        }
      }
      if (cell && cell.w === this.RemarkTag.n) {
        break;
      }
    }
    if (this.pos.ShortName === 0) {
      let e = new Error("this service can't decode")
      e.code = 101;
      throw e;
    }
  }

  setResReqCell() {
    let firstCol = this.getFirstCol(this.ref);
    for (let R = firstCol.s.r; R < firstCol.e.r; ++R) {
      let cell_address = {c: 0, r: R};
      let cell_ref = XLSX.utils.encode_cell(cell_address);
      let cell = this.sheet[cell_ref];
      if (cell.w && cell.w.match(this.res.reg)) {
        this.res.cell_ref = cell_ref;
        this.res.name = cell.w;
        break;
      }
      else if (cell.w && cell.w.match(this.req.reg)) {
        this.req.cell_ref = cell_ref;
        this.req.name = cell.w;
      }
    }
  }

  getReqNameRange() {
    let sa = XLSX.utils.encode_col(XLSX.utils.decode_range(this.pos.Name).e.c);
    let ea = XLSX.utils.encode_col(XLSX.utils.decode_range(this.pos.ShortName).e.c - 1);
    let rangeStr = sa + (XLSX.utils.decode_range(this.req.cell_ref).e.r + 1) + ":" + ea + (XLSX.utils.decode_range(this.res.cell_ref).e.r);
    return XLSX.utils.decode_range(rangeStr);
  }

  getResNameRange() {
    let sa = XLSX.utils.encode_col(XLSX.utils.decode_range(this.pos.Name).e.c);
    let ea = XLSX.utils.encode_col(XLSX.utils.decode_range(this.pos.ShortName).e.c - 1);
    let rangeStr = sa + (XLSX.utils.decode_range(this.res.cell_ref).s.r + 1) + ":" + ea + (this.ref.e.r + 1);
    return XLSX.utils.decode_range(rangeStr);
  }

  getModel(trange) {
    let model = {};
    let pModel = undefined;
    for (let R = trange.s.r; R <= trange.e.r; ++R) {
      for (let C = trange.s.c; C <= trange.e.c; ++C) {
        let cell_address = {c: C, r: R};
        /* if an A1-style address is needed, encode the address */
        let cell_ref = XLSX.utils.encode_cell(cell_address);
        let cell = this.sheet[cell_ref];
        if (cell && cell.w !== undefined && cell.w.trim() !== "") {
          let cnt = (C - trange.s.c);
          let shortname = undefined;
          let type = undefined;
          let metadata = undefined;
          let length = undefined;
          let required = undefined;
          let range = undefined;
          let version = undefined;
          let remark = undefined;
          if (this.pos.ShortName !== 0) {
            shortname = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.ShortName).c, r: R})].w;
          }
          if (this.pos.Type !== 0) {
            type = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Type).c, r: R})].w;
          }
          if (this.pos.Metadata !== 0) {
            metadata = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Metadata).c, r: R})].w;
          }
          if (this.pos.Length !== 0) {
            length = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Length).c, r: R})].w;
          }
          if (this.pos.Required !== 0) {
            required = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Required).c, r: R})].w;
          }
          if (this.pos.Range !== 0) {
            range = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Range).c, r: R})].w;
          }
          if (this.pos.Version !== 0) {
            version = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Version).c, r: R})].w;
          }
          if (this.pos.Remark !== 0) {
            remark = this.sheet[XLSX.utils.encode_cell({c: XLSX.utils.decode_cell(this.pos.Remark).c, r: R})].w;
          }
          if (cnt === 0) {
            let tmpModel = {};
            tmpModel["ShortName"] = shortname;
            tmpModel["Type"] = type;
            tmpModel["Metadata"] = metadata;
            tmpModel["Length"] = length;
            tmpModel["Required"] = required;
            tmpModel["Range"] = range;
            tmpModel["Version"] = version;
            tmpModel["Remark"] = remark;
            if (metadata === "List" || metadata === "NullableClass") {
              tmpModel["Fields"] = {};
            }
            model[cell.w.trim()] = tmpModel;
            pModel = tmpModel;
          }
          else {
            let tmpModel = {};
            tmpModel["ShortName"] = shortname;
            tmpModel["Type"] = type;
            tmpModel["Metadata"] = metadata;
            tmpModel["Length"] = length;
            tmpModel["Required"] = required;
            tmpModel["Range"] = range;
            tmpModel["Version"] = version;
            tmpModel["Remark"] = remark;
            if (metadata === "List" || metadata === "NullableClass") {
              tmpModel["Fields"] = {};
            }
            if (pModel.Metadata === "List" || pModel.Metadata === "NullableClass") {
              pModel["Fields"][cell.w.trim()] = tmpModel;
            }
          }
        }
      }
    }
    return model;
  }

  getReqModel(sheetName) {
    let reqModel;
    try {
      this.setSheet(this.workbook.Sheets[sheetName]);
      let reqRange = this.getReqNameRange();
      reqModel = this.getModel(reqRange);
    }
    catch (e) {
      throw e
    }
    return reqModel;
  }

  getResModel(sheetName) {
    let resModel;
    try {
      this.setSheet(this.workbook.Sheets[sheetName]);
      let resRange = this.getResNameRange();
      resModel = this.getModel(resRange);
    }
    catch (e) {
      throw e
    }
    return resModel;
  }
}

export default QYDecode;