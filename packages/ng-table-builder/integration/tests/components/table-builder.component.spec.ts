import { Component, Injectable, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlainObject } from '@angular-ru/common/typings';
import { WebWorkerThreadService } from '@angular-ru/common/webworker';
import { TableBuilderComponent, TableBuilderModule, TableRow } from '@angular-ru/ng-table-builder';

@Component({
    selector: 'app-ngx-table-builder-mock',
    template: ` <ngx-table-builder [source]="data" [sort-types]="sortTypes"></ngx-table-builder>`
})
class NgxTableBuilderMockComponent {
    @ViewChild(TableBuilderComponent, { static: true }) public tableBuilderComponent!: TableBuilderComponent;

    public data: TableRow[] = [
        { id: 1, name: 'Max', lastName: 'Ivanov' },
        { id: 2, name: 'Ivan', lastName: 'Petrov' },
        { id: 3, name: 'Petr', lastName: 'Sidorov' }
    ];

    public sortTypes: PlainObject | null = null;
}

@Injectable()
class MockWebWorkerThreadService {
    public run<T, K>(workerFunction: (input?: K) => T, data?: K): Promise<T> {
        return Promise.resolve(workerFunction(data));
    }
}

describe('[TEST] Table builder', (): void => {
    let componentFixture: ComponentFixture<NgxTableBuilderMockComponent>;
    let component: NgxTableBuilderMockComponent;

    beforeEach((): void => {
        TestBed.configureTestingModule({
            declarations: [NgxTableBuilderMockComponent],
            imports: [TableBuilderModule],
            providers: [
                {
                    provide: WebWorkerThreadService,
                    useClass: MockWebWorkerThreadService
                }
            ]
        }).compileComponents();
    });

    beforeEach((): void => {
        componentFixture = TestBed.createComponent(NgxTableBuilderMockComponent);
        component = componentFixture.componentInstance;
        componentFixture.autoDetectChanges();
    });

    it('should correct sort by input', (): void => {
        const tableBuilderComponent: TableBuilderComponent = component.tableBuilderComponent;

        component.sortTypes = { id: 'desc' };
        componentFixture.detectChanges();
        expect(tableBuilderComponent.source).toEqual([
            { id: 3, name: 'Petr', lastName: 'Sidorov' },
            { id: 2, name: 'Ivan', lastName: 'Petrov' },
            { id: 1, name: 'Max', lastName: 'Ivanov' }
        ]);

        component.sortTypes = { name: 'asc' };
        componentFixture.detectChanges();
        expect(tableBuilderComponent.source).toEqual([
            { id: 2, name: 'Ivan', lastName: 'Petrov' },
            { id: 1, name: 'Max', lastName: 'Ivanov' },
            { id: 3, name: 'Petr', lastName: 'Sidorov' }
        ]);
    });
});