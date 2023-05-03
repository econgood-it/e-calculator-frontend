import {
  SectionSchema,
  WorkbookResponseBodySchema,
} from '@ecogood/e-calculator-schemas/dist/workbook.dto';
import { z } from 'zod';
export type WorkbookResponse = z.infer<typeof WorkbookResponseBodySchema>;
type Section = z.infer<typeof SectionSchema>;

export interface IWorkbook {
  getSection(shortName: string): Section | undefined;
  hasSection(shortName: string): boolean;
  getSections(): Section[];
}

export class Workbook implements IWorkbook {
  private sections: Map<string, Section>;
  constructor(workbookResponse: WorkbookResponse) {
    this.sections = new Map<string, Section>(
      workbookResponse.sections.map((s) => [s.shortName, s])
    );
  }

  public hasSection(shortName: string): boolean {
    return this.sections.has(shortName);
  }

  public getSection(shortName: string): Section | undefined {
    return this.sections.get(shortName);
  }

  public getSections(): Section[] {
    return [...this.sections.values()];
  }
}
